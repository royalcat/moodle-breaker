FROM golang:1.20 AS build
RUN go build -v std

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY ./src ./src

RUN CGO_ENABLED=0 go build -o /moodle-breaker ./src/main.go 

# run container
FROM scratch

COPY ./dist /dist
COPY --from=build /moodle-breaker /moodle-breaker


ENTRYPOINT [ "/moodle-breaker" ]