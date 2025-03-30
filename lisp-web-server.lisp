;Load modules
(ql:quickload '("hunchentoot" "caveman2" "spinneret"
                "djula" "easy-routes"))

;Set up acceptor and start listening on 4242..
(defvar *acceptor* (make-instance 'hunchentoot:easy-acceptor
                                  :port 4242))
(hunchentoot:start *acceptor*)

;Set another directory to serve pages from...
(setf (hunchentoot:acceptor-document-root *acceptor*)
      #p"/home/cryptao/Development/Conexus/www")
