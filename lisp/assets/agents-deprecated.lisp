(defparameter *stat-baseline* 50)

(defparameter *agents* '())

(defstruct agent
	   id
	   name
	   mind
	   body
	   dex
	   str
	   cool
	   int
	   age
	   faction
	   cash
	   location
	   notes) 

(defun save-agents (filename)
	   (with-open-file (out filename
				:direction :output
				:if-exists :supersede)
	     (with-standard-io-syntax
	       (print *agents* out))))

(defun load-db (filename)
  (with-open-file (in filename)
    (with-standard-io-syntax
      (setf *agents* (read in)))))

(defun action (agent-id base-diff stat)
	   ())

(defun new-agent (id name default-stat age faction cash location notes agents-var)
  (push (list id (make-agent :id id :name name :mind default-stat :body default-stat :dex default-stat :str default-stat :cool default-stat :int default-stat :age age :faction faction :cash cash :location location :notes notes)) *agents*))
