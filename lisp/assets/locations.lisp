

(defparameter *node1* '((front-bar ("The front bar of the Hole In The Wall is generally crowded with young wannabe Sketchers and the people who prey on them - pimps and their charges, dealers etc. If you want some of the more specialised services on offer you'll need access to the Backroom. This is harder than it sounds. Invitation only - this is enforced by two or more of the Hole's Security - big guys with pumped muscles generally packing some sort of heat somewhere about their person."))
  
(backroom (The backroom of the Hole is where you go for anything beyond the normal.))

			(alley (You are in the alley behind the bar. It stinks of piss and vomit. There is someone passed out at your feet.))))


(defparameter *node2* '((street (The main drag of The Street is a constant bustle of activity as people hustle their way through the neon-lit night or the drab overcast day.))))

(defparameter *node3* '((hammerandspoon (The Hammer and The Spoon is an ultra-exclusive "Gentlemens Club" (although they have allowed women to become members since 1921) catering to a wide variety of generally upper-class individuals. A large number of these work for the government of this country or another and almost everyone has at least one shady agenda above and beyond their more obvious concerns.))))

(defparameter *mappings* `((1 (The Hole In The Wall) ,*node1*)
			   (2 (The Street) ,*node2*)
			   (3 (The Hammer and the Spoon) ,*node3*)))

(defun getlocationname (loc-id mappings) (cadr (assoc loc-id mappings)))

(defun getlocationdesc (loc-id mappings) (caddr (assoc loc-id mappings)))

(defun make-inventory (item quantity project)
	   (list :item item :qty quantity :project project))
