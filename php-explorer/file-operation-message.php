<?php
session_start();

$message = $_GET["message"];
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Message</title>
    </head>
    <body>
        <script type="text/javascript">
            let message = "<?php echo(urldecode($message)); ?>";
            window.alert(message);
            window.close();
        </script>
    </body>
</html>
