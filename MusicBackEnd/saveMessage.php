<?php
// save_message.php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name    = trim($_POST['name'] ?? '');
    $email   = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if ($name === '' || $email === '' || $message === '') {
        $error = "All fields are required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Invalid email address.";
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO contact_messages (name, email, message)
            VALUES (:name, :email, :message)
        ");
        $stmt->execute([
            ':name'    => $name,
            ':email'   => $email,
            ':message' => $message,
        ]);

        header("Location: thank_you.php");
        exit;
    }
} else {
    $error = "Invalid request method.";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Contact Error</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>There was a problem</h1>
  <p><?php echo htmlspecialchars($error ?? "Unknown error."); ?></p>
  <p><a href="contact.php">Go back to the contact form</a></p>
</body>
</html>
