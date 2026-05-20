<?php
// messages.php
require __DIR__ . '/config.php';

$stmt = $pdo->query("SELECT id, name, email, message, created_at FROM contact_messages ORDER BY created_at DESC");
$messages = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Contact Messages – Admin</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui, sans-serif; padding: 20px; background:#050512; color:#f5f5ff; }
    h1 { margin-bottom:1rem; }
    table { border-collapse: collapse; width: 100%; background:#101020; color:#f5f5ff; }
    th, td { padding: 0.5rem; border: 1px solid #333; vertical-align: top; }
    th { background:#151530; }
    tr:nth-child(even) { background:#0a0a18; }
  </style>
</head>
<body>
  <h1>Contact Messages (Admin)</h1>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>When</th>
        <th>Name</th>
        <th>Email</th>
        <th>Message</th>
      </tr>
    </thead>
    <tbody>
      <?php if (!$messages): ?>
        <tr><td colspan="5">No messages yet.</td></tr>
      <?php else: ?>
        <?php foreach ($messages as $row): ?>
          <tr>
            <td><?php echo (int)$row['id']; ?></td>
            <td><?php echo htmlspecialchars($row['created_at']); ?></td>
            <td><?php echo htmlspecialchars($row['name']); ?></td>
            <td><?php echo htmlspecialchars($row['email']); ?></td>
            <td><?php echo nl2br(htmlspecialchars($row['message'])); ?></td>
          </tr>
        <?php endforeach; ?>
      <?php endif; ?>
    </tbody>
  </table>
</body>
</html>
