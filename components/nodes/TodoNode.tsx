import React, { useState } from "react";
import { NodeProps } from "@xyflow/react";
import { Plus, X, CheckSquare, Square } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";
import { useCanvasStore, type CustomNode, type TodoItem } from "@/store/canvasStore";

export const TodoNode: React.FC<NodeProps<CustomNode>> = ({ id, data, selected }) => {
  const updateNodeData = useCanvasStore((state) => state.updateNodeData);
  const [newTodoText, setNewTodoText] = useState("");

  const title = data.title || "Checklist";
  const items: TodoItem[] = data.items || [];

  const handleTitleChange = (newTitle: string) => {
    updateNodeData(id, { title: newTitle });
  };

  const toggleTodo = (todoId: string) => {
    const updatedItems = items.map((item) =>
      item.id === todoId ? { ...item, completed: !item.completed } : item
    );
    updateNodeData(id, { items: updatedItems });
  };

  const addTodo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTodoText.trim()) return;

    const newItem: TodoItem = {
      id: `${Date.now()}`,
      text: newTodoText.trim(),
      completed: false,
    };

    updateNodeData(id, { items: [...items, newItem] });
    setNewTodoText("");
  };

  const removeTodo = (todoId: string) => {
    const updatedItems = items.filter((item) => item.id !== todoId);
    updateNodeData(id, { items: updatedItems });
  };

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <NodeWrapper
      id={id}
      title={title}
      onTitleChange={handleTitleChange}
      selected={selected}
      icon={<CheckSquare size={14} className="text-purple-400" />}
    >
      <div className="flex flex-col gap-3">
        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="flex flex-col gap-1 select-none">
            <div className="flex justify-between text-[11px] text-neutral-500 font-semibold tracking-wider uppercase">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Todo Items */}
        <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 py-1 px-2 rounded-lg hover:bg-neutral-900/50 transition-colors group/item"
            >
              <button
                onClick={() => toggleTodo(item.id)}
                className="flex items-start gap-2.5 text-left flex-1 text-sm text-neutral-300 cursor-pointer"
              >
                <span className="mt-0.5 text-purple-500 shrink-0">
                  {item.completed ? (
                    <CheckSquare size={16} className="fill-purple-500/10" />
                  ) : (
                    <Square size={16} />
                  )}
                </span>
                <span
                  className={`break-all leading-tight transition-all ${
                    item.completed ? "line-through text-neutral-600" : ""
                  }`}
                >
                  {item.text}
                </span>
              </button>
              <button
                onClick={() => removeTodo(item.id)}
                className="opacity-0 group-hover/item:opacity-100 p-0.5 text-neutral-600 hover:text-red-400 hover:bg-neutral-800 rounded transition-all cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {totalCount === 0 && (
            <div className="text-center py-4 text-xs text-neutral-600 italic select-none">
              No tasks added yet.
            </div>
          )}
        </div>

        {/* Add Todo Input */}
        <form onSubmit={addTodo} className="flex gap-2 mt-1">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="Add streak tasks..."
          />
          <button
            type="submit"
            className="p-1.5 bg-neutral-900 hover:bg-purple-500 text-neutral-400 hover:text-white border border-neutral-800 hover:border-purple-600 rounded-lg transition-all cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </form>
      </div>
    </NodeWrapper>
  );
};
