import TodoList from "@/app/components/TodoList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          My Todo App
        </h1>
        <TodoList />
      </div>
    </main>
  );
}