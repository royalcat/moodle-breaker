

run-server: upload-ext
	CGO_ENABLED=0 go build main.go && \
	ssh "systemctl stop moodle-breaker.service" && \
	scp main root@192.168.217.122:~ && \
	ssh "systemctl start moodle-breaker.service"

upload-ext:
	scp -r ./extension root@192.168.217.122:~