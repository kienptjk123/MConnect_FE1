// "use client";

// import type React from "react";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Plus } from "lucide-react";
// import { TaskType } from "@/schemaValidations/taskKanban.schema";

// interface AddTaskDialogProps {
//   onAddTask: (task: Omit<TaskType, "id">) => void;
//   status: TaskType["status"];
// }

// export function AddTaskDialog({ onAddTask, status }: AddTaskDialogProps) {
//   const [open, setOpen] = useState(false);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [priority, setPriority] = useState<"low" | "high">("low");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!title.trim()) return;

//     const newTask: Omit<TaskType, "id"> = {
//       title: title.trim(),
//       description: description.trim() || undefined,
//       priority,

//       comments: 0,
//       files: 0,
//       status,
//     };

//     onAddTask(newTask);

//     // Reset form
//     setTitle("");
//     setDescription("");
//     setPriority("low");
//     setOpen(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           variant="ghost"
//           size="sm"
//           className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
//         >
//           <Plus className="h-4 w-4" />
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Add New Task</DialogTitle>
//             <DialogDescription>
//               Create a new task for the{" "}
//               {status === "todo"
//                 ? "To Do"
//                 : status === "progress"
//                 ? "On Progress"
//                 : "Done"}{" "}
//               column.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid gap-2">
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Enter task title..."
//                 required
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="description">Description</Label>
//               <Textarea
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Enter task description..."
//                 rows={3}
//               />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="priority">Priority</Label>
//               <Select
//                 value={priority}
//                 onValueChange={(value: "low" | "high") => setPriority(value)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select priority" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="low">Low</SelectItem>
//                   <SelectItem value="high">High</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={!title.trim()}>
//               Add Task
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
