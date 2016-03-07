# nodejs-https-keepalive-test
https keepalives don't seem to be working as expected

turns out I was attaching too many onClose listeners - one per request - making it look like there were too many connections.
