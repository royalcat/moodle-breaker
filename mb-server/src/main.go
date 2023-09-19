package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/caarlos0/env/v8"
	"github.com/julienschmidt/httprouter"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/royalcat/btrgo"
	"github.com/rs/cors"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var coll *mongo.Collection

type QuestionResult struct {
	Id           primitive.ObjectID `json:"-" bson:"_id"`
	TestId       int                `json:"test_id" bson:"test_id"`
	QuestionText string             `json:"question_text" bson:"question_text"`
	Answers      []Answer           `json:"answers" bson:"answers"`
}

type Answer struct {
	Text   string  `json:"text" bson:"text"`
	Result float64 `json:"result" bson:"result"`
}

func AddQuestionResult(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	q := QuestionResult{}
	err := json.NewDecoder(r.Body).Decode(&q)
	if err != nil {
		logrus.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Ты пидор: %s", err.Error())
		return
	}

	q.Id = primitive.NewObjectID()
	_, err = coll.InsertOne(r.Context(), q)
	if err != nil {
		logrus.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Я пидор: %s", err.Error())
		return
	}
}

type QuestionRequest struct {
	TestId       int    `json:"test_id" bson:"test_id"`
	QuestionText string `json:"question_text" bson:"question_text"`
}

func GetQuestionResult(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	ctx := r.Context()

	q := QuestionRequest{}
	err := json.NewDecoder(r.Body).Decode(&q)
	if err != nil {
		logrus.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Ты пидор: %s", err.Error())
		return
	}

	answers, err := searchAnswers(ctx, q.QuestionText, q.TestId)
	if err != nil {
		logrus.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Я пидор: %s", err.Error())
		return
	}

	fin := getQuestionResult(answers)

	body, err := json.Marshal(fin)
	if err != nil {
		logrus.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Я пидор: %s", err.Error())
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(body)
}

func queryQuestionResult(ctx context.Context, filter bson.D, opts ...*options.FindOptions) ([]QuestionResult, error) {
	var results []QuestionResult
	cursor, err := coll.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	err = cursor.All(ctx, &results)
	if err != nil {
		return nil, err
	}
	err = cursor.Close(ctx)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func searchAnswers(ctx context.Context, question string, testId int) ([]QuestionResult, error) {
	filter := bson.D{
		{Key: "test_id", Value: testId},
		{Key: "question_text", Value: question},
	}

	results, err := queryQuestionResult(ctx, filter)
	if err != nil {
		return nil, err
	}

	if len(results) != 0 {
		return results, nil
	}

	filter = bson.D{
		{Key: "question_text", Value: question},
	}

	results, err = queryQuestionResult(ctx, filter)
	if err != nil {
		return nil, err
	}

	if len(results) != 0 {
		return results, nil
	}

	filter = bson.D{{
		Key: "$text",
		Value: bson.D{
			{Key: "$search", Value: question},
		},
	}}
	opts := options.Find()
	opts.SetProjection(bson.D{{Key: "score", Value: bson.E{Key: "$meta", Value: "textScore"}}})
	opts.SetSort(bson.D{{Key: "score", Value: bson.E{Key: "$meta", Value: "textScore"}}})
	opts.SetLimit(8)
	results, err = queryQuestionResult(ctx, filter)
	if err != nil {
		return nil, err
	}

	return results, nil
}

func getQuestionResult(results []QuestionResult) QuestionResult {
	answers := map[string]Answer{}
	var maxRes float64

	for _, res := range results {
		for _, answ := range res.Answers {
			if answ.Result > 0 {
				savedAnsw, ok := answers[answ.Text]
				if ok {
					if savedAnsw.Result < answ.Result {

					}
				} else {
					answers[answ.Text] = answ
				}

				if answ.Result > maxRes {
					maxRes = answ.Result
				}
			}
		}
	}

	return QuestionResult{
		Answers: btrgo.ValuesOfMap(answers),
	}
}

func cleanUp() error {
	ctx := context.Background()
	agg := bson.A{
		bson.D{
			{Key: "$group", Value: bson.D{
				{Key: "_id", Value: bson.D{
					{Key: "test_id", Value: "$test_id"},
					{Key: "question_text", Value: "$question_text"},
				}},
				{Key: "answers", Value: bson.D{
					{Key: "$push", Value: bson.D{
						{Key: "_id", Value: "$_id"},
						{Key: "answers", Value: "$answers"},
					}},
				}},
			}},
		},
	}

	cur, err := coll.Aggregate(ctx, agg)
	if err != nil {
		return err
	}
	var res []CleanAggregationResult
	err = cur.All(ctx, &res)
	if err != nil {
		return err
	}

	var DeletedCount int64

	for _, questionResults := range res {
		maxResult := struct {
			Result float64
			ID     primitive.ObjectID
		}{}

		for _, answ := range questionResults.Answers {
			sum := ResultSum(answ.Answers)
			if sum > maxResult.Result {
				maxResult.Result = sum
				maxResult.ID = answ.Id
			}
		}

		toClean := []primitive.ObjectID{}
		for _, answ := range questionResults.Answers {
			if maxResult.ID != answ.Id {
				toClean = append(toClean, answ.Id)
			}
		}

		if len(toClean) > 0 {
			logrus.Infof(
				"To clean %d answers out of %d for question: %s of testId: %d\n",
				len(toClean), len(questionResults.Answers),
				questionResults.Question.Text, questionResults.Question.TestId,
			)

			filter := bson.M{"_id": bson.M{"$in": toClean}}
			res, err := coll.DeleteMany(ctx, filter)
			if err != nil {
				return err
			}
			DeletedCount += res.DeletedCount
		}

	}

	logrus.Infof("Cleaned up %d answers", DeletedCount)

	return nil
}

func ResultSum(answers []Answer) float64 {
	sum := 0.0
	for _, a := range answers {
		sum += a.Result
	}
	return sum
}

type CleanAggregationResult struct {
	Question struct {
		TestId int    `bson:"test_id"`
		Text   string `bson:"question_text"`
	} `bson:"_id"`
	Answers []struct {
		Id      primitive.ObjectID `bson:"_id"`
		Answers []Answer           `bson:"answers"`
	}
}

var (
	getQuestionTime = promauto.NewHistogramVec(prometheus.HistogramOpts{
		Name: "get_question_time",
		Help: "The total number of processed events",
	}, []string{"time_sec", "status"})
)

type config struct {
	MongoUrl string `env:"MONGO_URL"`
	Listen   string `env:"LISTEN" envDefault:":8080"`
}

func main() {
	cfg := config{}
	if err := env.Parse(&cfg); err != nil {
		log.Fatal("Parse config error: ", err.Error())
	}

	clientOptions := options.Client().ApplyURI(cfg.MongoUrl)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	db := client.Database("moodle-breaker")
	coll = db.Collection("answers")

	router := httprouter.New()
	router.POST("/addQuestionResult", AddQuestionResult)
	router.POST("/getQuestionResult", GetQuestionResult)
	router.ServeFiles("/extension/*filepath", http.Dir("./dist/extension"))

	handler := cors.AllowAll().Handler(router)

	ctx, cancelBackground := context.WithCancel(context.Background())
	ticker := time.NewTicker(time.Hour)
	go func() {
		for {
			select {
			case <-ticker.C:
				err := cleanUp()
				if err != nil {
					logrus.Errorf("Error cleaning up: %s", err.Error())
				}
			case <-ctx.Done():
				ticker.Stop()
				return
			}
		}
	}()
	defer cancelBackground()

	log.Fatal(http.ListenAndServe(cfg.Listen, handler))
}
