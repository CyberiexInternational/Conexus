(load "~/Development/Conexus/lisp/assets/locations.lisp")

(defparameter *nodes* '((main-bar (You are in the main bar. It's pretty much empty. Leon the barman is leaning on the counter poking at a projecter unit with a paperclip.))
				 (backroom (You are in the backroom. Three thuggish looking guys are staring at you. The Manager smiles politely from behind a cheap desk.))
			 (alley (You are in the alley behind the bar. It stinks of piss and vomit. There is someone passed out at your feet.))))

(defun describe-location (location nodes)
  (cadr (assoc location nodes)))

(defparameter *edges* '((main-bar (backroom back door)
				  (alley outside door))
				 (backroom (main-bar front door))
				 (alley (main-bar inside door))))

(defun describe-path (edge) 
	   `(there is a ,(caddr edge) going, (cadr edge) from here.))

(defun describe-paths (location edges)
  (apply #'append (mapcar #'describe-path (cdr (assoc location edges)))))

(defparameter *objects* '(bottle dataslate knife))

(defparameter *object-locations* '((bottle main-bar)
					    (dataslate backroom)
					    (knife alley)
				   (open-drain alley)))

(defun objects-at (loc objs obj-locs)
	   (labels ((at-loc-p (obj)
		      (eq (cadr (assoc obj obj-locs)) loc)))
	     (remove-if-not #'at-loc-p objs)))

(defun describe-objects (loc objs obj-loc)
	   (labels ((describe-obj (obj)
		      `(you see a ,obj on the floor.)))
	     (apply #'append (mapcar #'describe-obj (objects-at loc objs obj-loc)))))

(defparameter *location* 'main-bar)

(defun walk (direction)
	   (let ((next (find direction
			     (cdr (assoc *location* *edges*))
			     :key #'cadr)))
	     (if next
		 (progn (setf *location* (car next))
			(look ))
		 '(you cannot got that way.))))

(defun pickup (object)
	   (cond ((member object
			  (objects-at *location* *objects* *object-locations*))
		  (push (list object 'body) *object-locations*)
		  `(you are now carrying the ,object))
		 (t '(you cannot get that.))))

(defun inventory ()
	   (cons 'items- (objects-at 'body *objects* *object-locations*)))

(defun look () 
	   (append (describe-location *location* *nodes*)
		   (describe-paths *location* *edges*)
		   (describe-objects *location* *objects*  *object-locations*)))

(defun game-read ()
	   (let ((cmd (read-from-string
		       (concatenate 'string "(" (read-line) ")"))))
	     (flet ((quote-it (x)
		      (list 'quote x)))
	       (cons (car cmd) (mapcar #'quote-it (cdr cmd))))))

(defparameter *wizard-nodes* '((living-room (you are in the living-room.
a wizard is snoring loudly on the couch.))
(garden (you are in a beautiful garden.
there is a well in front of you.))
(attic (you are in the attic. there
	is a giant welding torch in the corner.))))

(defparameter *wizard-edges* '((living-room (garden west door)
(attic upstairs ladder))
(garden (living-room east door))
			       (attic (living-room downstairs ladder))))

