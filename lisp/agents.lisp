(defparameter *agents* ())

(defun new-agent (agent-list id name default-stat age faction cash location notes agents-var)
  (push (cons id (list :id id :name name :mind default-stat :body default-stat :dex default-stat :str default-stat :cool default-stat :int default-stat :age age :faction faction :cash cash :location location :notes notes :vars agents-var)) *agents*))
