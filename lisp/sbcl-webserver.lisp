;Simple (for now) web server - hopefully flexible enough for Conexus front end server - will need to modify some biuts for SBCL compliance..

(defun http-char (c1 c2 &optional (default #\Space))
  (let ((code (parse-integer
	       (coerce (list c1 c2) 'string)
	       :radix 16
	       :junk-allowed t)))
    (if code
	(code-char code)
	default)))

(defun decode-param (s)
  (labels ((f (lst)
	     (when lst
	       (case (car lst)
		 (#\% (cons (http-char (cadr lst) (caddr lst))
			    (f (cdddr lst))))
		 (#\+ (cons #\space (f (cdr lst))))
		 (otherwise (cons (car lst) (f (cdr lst))))))))
    (coerce (f (coerce s 'list)) 'string)))

(defun parse-params (s)
	   (let* ((i1 (position #\= s))
		  (i2 (position #\& s)))
	     (cond (i1 (cons (cons (intern (string-upcase (subseq s 0 i1)))
				   (decode-param (subseq s (1+ i1) i2)))
			     (and i2 (parse-params (subseq s (1+ i2))))))
		   ((equal s "") nil)
		   (t s))))

(defun parse-url (s)
(let* ((url (subseq s
(+ 2 (position #\space s))
(position #\space s :from-end t)))
(x (position #\? url)))
(if x
(cons (subseq url 0 x) (parse-params (subseq url (1+ x))))
(cons url '()))))

(defun get-header (stream)
(let* ((s (read-line stream))
(h (let ((i (position #\: s)))
(when i
(cons (intern (string-upcase (subseq s 0 i)))
(subseq s (+ i 2)))))))
(when h
(cons h (get-header stream)))))

(defun get-content-params (stream header)
(let ((length (cdr (assoc 'content-length header))))
(when length
(let ((content (make-string (parse-integer length))))
(read-sequence content stream)
(parse-params content)))))

(defun serve (request-handler)
(let ((socket (sb-bsd-sockets:socket-bind server *address* *port*))
(unwind-protect
(loop (with-open-stream (stream (sb-bsd-sockets:socket-accept socket))
(let* ((url
(parse-url (read-line stream)))
(path
(car url))
(header (get-header stream))
(params (append (cdr url)
(get-content-params stream header)))
(*standard-output* stream))
(funcall request-handler path header params))))
(sb-bsd-sockets:socket-close socket))))

;;The code below is taken from the SBCL documentation
(defparameter *address* #(0 0 0 0))
(defparameter *port* 8080)

(defun start-server ()
    (let ((server (make-instance 'sb-bsd-sockets:inet-socket :type :stream :protocol :tcp)))
        (setf (sb-bsd-sockets:sockopt-reuse-address server) t)
        (setf (sb-bsd-sockets:non-blocking-mode server) t)
        (sb-bsd-sockets:socket-bind server *address* *port*)
        (sb-bsd-sockets:socket-listen server 1)))

(defun handle-connection (connection)
    (sb-thread:make-thread (lambda ()
                             (loop
                                (let ((data (read-from-connection connection)))
                                    (sb-bsd-sockets:socket-send connection data 0 (length data))
                                    (when (zerop (length data))
                                        (return))))
                            (sb-bsd-sockets:socket-close connection))))
