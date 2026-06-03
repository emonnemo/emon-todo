"use client";

import * as React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Text,
} from "@emonnemo/ui";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Circle,
  MoreHorizontal,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";

type TaskStatus = "open" | "finished" | "canceled";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
};

const STORAGE_KEY = "emon-todo:tasks";

const defaultTasks: Task[] = [
  { id: "task-1", title: "Try the local UI package", status: "open" },
  { id: "task-2", title: "Publish a patch version", status: "open" },
  { id: "task-3", title: "Install it in a real app", status: "finished" },
];

function loadTasks(): Task[] {
  if (typeof window === "undefined") return defaultTasks;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTasks;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultTasks;
    return parsed;
  } catch {
    return defaultTasks;
  }
}

const statusLabel: Record<TaskStatus, string> = {
  open: "Open",
  finished: "Finished",
  canceled: "Canceled",
};

export default function TodoPage() {
  const [tasks, setTasks] = React.useState<Task[]>(loadTasks);
  const [newTask, setNewTask] = React.useState("");

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const totals = React.useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        acc[task.status] += 1;
        return acc;
      },
      { open: 0, finished: 0, canceled: 0 } as Record<TaskStatus, number>
    );
  }, [tasks]);

  function createTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = newTask.trim();
    if (!title) return;

    setTasks((current) => [
      { id: crypto.randomUUID(), title, status: "open" },
      ...current,
    ]);
    setNewTask("");
  }

  function setTaskStatus(id: string, status: TaskStatus) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, status } : task))
    );
  }

  function moveTask(id: string, direction: "up" | "down") {
    setTasks((current) => {
      const index = current.findIndex((task) => task.id === id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [task] = next.splice(index, 1);
      next.splice(targetIndex, 0, task);
      return next;
    });
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-3xl gap-8">
        <header className="grid gap-3">
          <Text variant="muted" as="p">
            @emonnemo/ui playground
          </Text>
          <div className="grid gap-2">
            <Text variant="h1">Todo checklist</Text>
            <Text variant="lead">
              Create, finish, cancel, and reorder tasks in a tiny app using your
              local UI kit.
            </Text>
          </div>
        </header>

        <form
          onSubmit={createTask}
          className="grid gap-3 rounded-lg border bg-card p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:items-end"
        >
          <div className="grid gap-2">
            <Label htmlFor="task">New task</Label>
            <Input
              id="task"
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              placeholder="Write something to do"
            />
          </div>
          <Button type="submit">
            <Plus className="h-4 w-4" />
            Add task
          </Button>
        </form>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Open" value={totals.open} />
          <Stat label="Finished" value={totals.finished} />
          <Stat label="Canceled" value={totals.canceled} />
        </div>

        <div className="grid gap-3">
          {tasks.length ? (
            tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                total={tasks.length}
                onStatusChange={setTaskStatus}
                onMove={moveTask}
              />
            ))
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <Text variant="muted">No tasks yet.</Text>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <Text variant="muted" as="div">
        {label}
      </Text>
      <Text variant="h3" as="div" className="mt-1">
        {value}
      </Text>
    </div>
  );
}

function TaskItem({
  task,
  index,
  total,
  onStatusChange,
  onMove,
}: {
  task: Task;
  index: number;
  total: number;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}) {
  const isFinished = task.status === "finished";
  const isCanceled = task.status === "canceled";

  return (
    <article className="grid gap-3 rounded-lg border bg-card p-4 shadow-sm sm:grid-cols-[auto_1fr_auto] sm:items-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
        {isFinished ? (
          <Check className="h-4 w-4 text-primary" />
        ) : isCanceled ? (
          <X className="h-4 w-4 text-destructive" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0">
        <Text
          variant="large"
          as="h2"
          className={
            isCanceled
              ? "text-muted-foreground line-through"
              : isFinished
                ? "text-muted-foreground"
                : undefined
          }
        >
          {task.title}
        </Text>
        <Text variant="muted" as="p">
          {statusLabel[task.status]}
        </Text>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={isFinished ? "secondary" : "outline"}
          size="sm"
          onClick={() =>
            onStatusChange(task.id, isFinished ? "open" : "finished")
          }
        >
          {isFinished ? (
            <RotateCcw className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {isFinished ? "Reopen" : "Finish"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <span className="sr-only">Open actions for {task.title}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={index === 0}
              onClick={() => onMove(task.id, "up")}
            >
              <ArrowUp className="h-4 w-4" />
              Move up
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={index === total - 1}
              onClick={() => onMove(task.id, "down")}
            >
              <ArrowDown className="h-4 w-4" />
              Move down
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusChange(task.id, "open")}>
              <RotateCcw className="h-4 w-4" />
              Reopen
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange(task.id, "canceled")}
            >
              <X className="h-4 w-4" />
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  );
}
