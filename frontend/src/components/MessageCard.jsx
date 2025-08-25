export default function MessageCard({ message }) {
  return (
    <div className="p-2 border rounded bg-white">
      <p>
        <strong>Platform:</strong> {message.platform}
      </p>
      <p>
        <strong>User:</strong> {message.userMessage}
      </p>
      <p>
        <strong>AI:</strong> {message.aiMessage}
      </p>
    </div>
  );
}
