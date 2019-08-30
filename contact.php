<?php

$receiver = "markus.staedler@weberlin-design.de";

if (isset($_POST["email"])) {
	$sender_mail = $_POST["email"];
} else {
	$sender_mail = "";
}

if (isset($_POST["subject"])) {
	$subject = $_POST["subject"];
} else {
	$subject = "Betreff"; 
}

if (isset($_POST)) {
	$message = "Von: ".$_POST["name"]."\n\n";
}

if (isset($_POST["message"])) {
	$message .= $_POST["message"];
} else {
	$message = "";
}

$header = "From: $sender_mail";

$mail_status = false;//mail($receiver, $subject, $message, $header);

?>

<!doctype html>
<html lang="de">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
		<meta name="keywords" content="webdesign, website, freelancer, berlin, berlin webdesign, berlin website, seo, html, css, javascript, php, hosting, ">
		<meta name="descritpion" content="" />
	  
		<title>Webdesign by Markus Städler</title>
	  
		<link rel="icon" href="images/favicon.ico" type="image/x-icon" />
		<link rel="canonical" href="http://weberlin-design.de">
		
		<link rel="stylesheet" href="style/normalize.css" type="text/css" />
		<link rel="stylesheet" href="style/general-style.css" type="text/css" />
		<link rel="stylesheet" href="style/contact-style.css" type="text/css" />
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.8/css/all.css" />
		
		<link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">
		
		<script src="script/contactScript.js" type="application/javascript" defer></script>
		<!-- Global site tag (gtag.js) - Google Analytics -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=UA-117686882-1"></script>
		<script>
		  window.dataLayer = window.dataLayer || [];
		  function gtag(){dataLayer.push(arguments);}
		  gtag('js', new Date());

		  gtag('config', 'UA-117686882-1');
		</script>

		<script type="text/javascript">
			var gaProperty = 'UA-117686882-1';
			var disableStr = 'ga-disable-' + gaProperty;
			if (document.cookie.indexOf(disableStr + '=true') > -1) {
				window[disableStr] = true;
			}
			function gaOptout() {
				document.cookie = disableStr + "=true; expires=Thu, 31 Dec 2099 23:59:59 UTC;path=/";
				window[disableStr] = true;
				alert("Das Tracking durch Google Analytics wurde in Ihrem Browser für diese Website deaktiviert.");
			}
		</script>
		<script>
		
			alert("Hallo Besucher! Leider ist die Website noch nicht hundertprozentig fertiggestellt und befindet sich grade in der Testphase. Die Texte müssen auch noch aktualisiert werden. Wenn Sie allerdings Anregungen oder Feeback mitteilen möchten, so können Sie das gern unter markus.staedler@weberlin-design.de tun. \nIch freue mich über jede konstruktive Kritik! :)");
		
		</script>
		<!--[if lt IE 9]>
			<script src="../script/html5shiv.js"></script>
		<![endif]-->
		
		<!--
		
			Webdesign by Markus Städler, markus.staedler@hotmail.de
		
		-->

	</head>
	<body>

		<div id="above-fold">
			<h1>Heading</h1>
			<div class="cool"></div>
			<a id="content-below">
				<i class="fas fa-angle-down fa-9x" aria-hidden="true"></i>
			</a>
		</div>
	
		<header class="header">
			
			<a class="menu-button" >
				<div class="bars">
					<span class="bar"></span>
					<span class="bar"></span>
					<span class="bar"></span>
				</div>
			</a>

			<nav id="main-nav">
				
				<div class="onpage">
					
					<div class="logo-div">
						<a href="index.html"><img src="images/logo2.png" alt="logo" /></a>
					</div>
					
				</div>
			
			</nav>
		
		</header>
		
		<main>
			
			<section id="dynamic">
			
				<?php
			
				if ($mail_status) {
					echo "<p class=".fine.">";
					echo "Ihre E-Mail wurde gesendet und ich werde mich schnellstmöglich mit Ihnen in Verbindung setzen";
				} else {
					echo "<p class=".error.">";
					echo "Ihre E-Mail konnte leider nicht zugeschickt werden. Möglicherweise ist ein technischer Fehler aufgetreten. Falls es beim nächsten Versuch nicht klappen sollte, dann versuchen Sie bitte, die Mail manuell zu erstellen.";
				}

				echo "</p>";
				
				?>
			
			</section>
			
			<section id="whats-next">
			
				<h2>Wie geht es jetzt weiter?</h2>
			
				<div class="gallery">
					
					<div class="left"><i class="fas fa-angle-left"></i></div>
					<div class="right"><i class="fas fa-angle-right"></i></div>
				
					<div class="wrapper first">
						<div id="div1" class="active">
							<i class="fas fa-image fa-4x"></i>
							<h3>Kontakt</h3>
							<p>sdlkfh lad lsd anv lslk nsadkj acsdnksdn lksdk asklvknsdvkjasdn v sdk sda vnkjnasdk vkjn vkjasdnv javn ajvn ivn weaiufb regiuhawgfisadhf iuar iur iurh ieriu iu viusabv ien viusnvkljdfsbv kvsbuishwerhceiorp i nvve nije fnsijfnv kfn aisdjvneoiu hvrigh ezgheuigh ersuivg rtoiu gvji bifn dfijovn sdkjvberiu nfiuov heriv eriu</p>
						</div><!--
					 --><div id="div2">
							<i class="fas fa-image fa-4x"></i>
							<h3>Angebot</h3>
							<p>sdlkfh lad lsd anv lslk nsadkj acsdnksdn lksdk asklvknsdvkjasdn v sdk sda vnkjnasdk vkjn vkjasdnv javn ajvn ivn weaiufb regiuhawgfisadhf iuar iur iurh ieriu iu viusabv ien viusnvkljdfsbv kvsbuishwerhceiorp i nvve nije fnsijfnv kfn aisdjvneoiu hvrigh ezgheuigh ersuivg rtoiu gvji bifn dfijovn sdkjvberiu nfiuov heriv eriu</p>
						</div><!--
					 --><div id="div3">
							<i class="fas fa-image fa-4x"></i>
							<h3>Planung</h3>
							<p>sdlkfh lad lsd anv lslk nsadkj acsdnksdn lksdk asklvknsdvkjasdn v sdk sda vnkjnasdk vkjn vkjasdnv javn ajvn ivn weaiufb regiuhawgfisadhf iuar iur iurh ieriu iu viusabv ien viusnvkljdfsbv kvsbuishwerhceiorp i nvve nije fnsijfnv kfn aisdjvneoiu hvrigh ezgheuigh ersuivg rtoiu gvji bifn dfijovn sdkjvberiu nfiuov heriv eriu</p>
						</div><!--
					 --><div id="div4">
							<i class="fas fa-image fa-4x"></i>
							<h3>Umsetzung</h3>
							<p>sdlkfh lad lsd anv lslk nsadkj acsdnksdn lksdk asklvknsdvkjasdn v sdk sda vnkjnasdk vkjn vkjasdnv javn ajvn ivn weaiufb regiuhawgfisadhf iuar iur iurh ieriu iu viusabv ien viusnvkljdfsbv kvsbuishwerhceiorp i nvve nije fnsijfnv kfn aisdjvneoiu hvrigh ezgheuigh ersuivg rtoiu gvji bifn dfijovn sdkjvberiu nfiuov heriv eriu</p>
						</div><!--
					 --><div id="div5">
							<i class="fas fa-image fa-4x"></i>
							<h3>Qualitäts-Management</h3>
							<p>sdlkfh lad lsd anv lslk nsadkj acsdnksdn lksdk asklvknsdvkjasdn v sdk sda vnkjnasdk vkjn vkjasdnv javn ajvn ivn weaiufb regiuhawgfisadhf iuar iur iurh ieriu iu viusabv ien viusnvkljdfsbv kvsbuishwerhceiorp i nvve nije fnsijfnv kfn aisdjvneoiu hvrigh ezgheuigh ersuivg rtoiu gvji bifn dfijovn sdkjvberiu nfiuov heriv eriu</p>
						</div><!--
					 --><div id="div6">
							<i class="fas fa-image fa-4x"></i>
							<h3>Projektabschluss</h3>
							<p>sdlkfh lad lsd anv lslk nsadkj acsdnksdn lksdk asklvknsdvkjasdn v sdk sda vnkjnasdk vkjn vkjasdnv javn ajvn ivn weaiufb regiuhawgfisadhf iuar iur iurh ieriu iu viusabv ien viusnvkljdfsbv kvsbuishwerhceiorp i nvve nije fnsijfnv kfn aisdjvneoiu hvrigh ezgheuigh ersuivg rtoiu gvji bifn dfijovn sdkjvberiu nfiuov heriv eriu</p>
						</div><!--
				   --></div>
				
				</div>
			
			</section>
					
			<footer>
				
				<a class="footer-stuff" href="impressum.html">Impressum</a>
				<a class="footer-stuff" href="data-privacy-statement.html">Datenschutzerklärung</a>
				
				<br/>
				
				<div>
					<a class="social" target="_blank" href="https://twitter.com/WeberlinDesign?lang=de"><i class="fab fa-twitter"></i></a>
					<a class="social" target="_blank" href="http://plus.google.com"><i class="fab fa-google-plus"></i></a>
					<a class="social" target="_blank" href="http://www.facebook.com"><i class="fab fa-facebook"></i></a>
					<a class="social" target="_blank" href="http://www.instagram.com/weberlin.design"><i class="fab fa-instagram"></i></a>
					<a class="social" target="_blank" href="https://www.linkedin.com/in/markus-städler-4900b5161"><i class="fab fa-linkedin"></i></a>
					<a class="social" target="_blank" href="https://www.xing.com/profile/Markus_Staedler5"><i class="fab fa-xing"></i></a>
				</div>
				
				<p>&copy; 2018 Markus Städler</p>
			
			</footer>
			
		</main>
		
		<a id="back-to-top">
			<i class="fas fa-arrow-up fa-3x"></i>
		</a>
		
		<div class="cookie-div">
			<p>Diese Seite verwendet Cookies. Mit der Nutzung dieser Website erklären Sie sich damit einverstanden, dass wir Cookies verwenden.</p>
			<a class="got-it">Verstanden</a>
			<a href="data-privacy-statement.html">Mehr Informationen</a>
		</div>
	
	</body>
</html>