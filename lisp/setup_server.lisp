(defpackage :com.gigamonkeys.web
  (:use :cl :net.aserve))

(in-package :com.gigamonkeys.web)

(start :port 2019)

;;Defines a simple function that returns an html page with a single random number between 0 and 1000
(defun random-number (request entity)
       (with-http-response (request entity :content-type "text/html")
	 (with-http-body (request entity)
	   (format
	    (request-reply-stream request)
	    "<html>~@
<head><title>Random</title>
</head>
<body>
<p>Random number : ~d</p>~@
</body></html>"
	    (random 1000)))))

