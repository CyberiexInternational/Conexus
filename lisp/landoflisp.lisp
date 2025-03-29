;Global variable definition with defparameter
(defparameter *foo* 7)

;Global function definition with defun
(defun foo (x) (+ 3 x))




;Local variable definition using let
(let ((a 5))
	   (+ a 5))

;Multiple local variable definitions using let 
(let ((a 5)
      (b 6))
     (+ a b))

;Local function definition using flet
 (flet ((foo (n)
		  (+ n 10)))
   (foo 5))

 ;Multiple local function definitions using flet
(flet ((f (n)
		  (+ n 10))
		(g (n)
		  (- n 3)))
  (g (f 5)))

;Make function names available within defined functions using labels
 (labels ((a (n)
		    (+ n 5))
		  (b (n)
		    (+ (a n) 6)))
   (b 10))

;Using car to return the first item in a list
(car '(3 4 5 6))
;returns 3

;Using cdr to return all but the first item in a list
(cdr '(3 4 5 6))
;returns (4 5 6)

;Using if as a conditional to test the symmetry of nil and () 
(if '()
    'i-am-true
    'i-am-false)

(if '(1)
    'i-am-true
    'i-am-false)

;List eating funtion to calculate list length
(defun my-length (list)
	   (if list
	       (1+ (my-length(cdr list)))
	       0))

;Testing conditional if for odd number
(if (oddp 6)
	     'odd-number
	     'even-number)

;Only one expression (number is odd) is evaluated, so (/ 1 0) can be used but not evaluated
(if (oddp 5)
    'odd-number
    (/ 1 0))

;Use progn to execute more than one form in each conditional result
(defvar *number-was-odd* nil)

(if (oddp 5)
	     (progn (setf *number-was-odd* t)
		    'oddnumber)
	     'even-number)

;Using when and unless as alternatives to if
(defvar *number-is-odd* nil)
(when (oddp 5)
  (setf *number-is-odd* t)
  'odd-number)

(unless (oddp 4)
  (setf *number-is-odd* nil)
  'even-number)

;important note regarding comparsion operator: If comparing symbols, use EQ. Otherwise use Equal

;Using cond for multiple conditional statements
(defun pudding-eater (person)
	   (cond ((eq person 'henry) (setf *arch-enemy* 'stupid-lisp-alien)
		  '(curse you lisp alien - you ate my pudding))
		 ((eq person 'johnny) (setf *arch-enemy* 'useless-old-johnny)
		  '(i hope you choked on my pudding johnny))
		 (t '(why you eat my pudding stranger?))))


;Branching with Case
(defun pudding-eater (person)
  (case person
    ((henry) (setf *arch-enemy* 'stupid-lisp-alien)
     '(curse you lisp alien - you aate my pudding))
    ((johnny) (setf *arch-enemy* 'useless-old-johnny)
     '(i hope you choked on my pudding johnny))
    (otherwise '(why you eating my pudding stranger?))))

 ;Dealing with Arrays

;Using make-array to...make an array...of five elements
(defparameter *glob-array* (make-array 5)) 

;Using aref to get a value at a given index
(aref *glob-array* 2) ;Gets the third item (array is zero-indexed) from the array 

;Using sref to set the value of an array index
(setf (aref *glob-array* 3) 'foo) ; Sets the fourth item in the aray to "foo"

;Making a hash table with make-hash-table
(defparamter *x* (make-hash-table))

;Getting a value from a hash table
(gethash 'foo *x*)

;Setting a value with setf and gethash
(setf (gethash 'foo *x*) '(something to put in the hash))


