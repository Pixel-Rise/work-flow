"use client";

import { useState } from "react";
import { KanbanBoard, KanbanCard, KanbanCards, KanbanHeader, KanbanProvider } from "@/components/ui/shadcn-io/kanban";
import type { DragEndEvent } from "@/components/ui/shadcn-io/kanban";
import { endOfMonth, startOfMonth, subDays, subMonths } from "date-fns";
import { useTranslation } from "@/components/language-provider";

const today = new Date();

const exampleStatuses = [
	{ id: "cancel", name: "Cancel", color: "#F87171" },
	{ id: "todo", name: "To Do", color: "#9CA3AF" },
	{ id: "in_progress", name: "In Progress", color: "#60A5FA" },
	{ id: "on_staging", name: "On Staging", color: "#FACC15" },
	{ id: "done", name: "Done", color: "#34D399" },
];

const initialTasks = [
	{
		id: "1",
		name: "Login Page",
		startAt: startOfMonth(subMonths(today, 1)),
		endAt: subDays(endOfMonth(today), 5),
		status: exampleStatuses[1],
		owner: {
			id: "1",
			name: "Azizbek Matsalayev",
			image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=1",
		},
	},
	{
		id: "2",
		name: "API Integration",
		startAt: startOfMonth(subMonths(today, 2)),
		endAt: endOfMonth(today),
		status: exampleStatuses[2],
		owner: {
			id: "2",
			name: "Ali Karimov",
			image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=2",
		},
	},
	{
		id: "3",
		name: "Staging Deployment",
		startAt: startOfMonth(subMonths(today, 1)),
		endAt: subDays(endOfMonth(today), 1),
		status: exampleStatuses[3],
		owner: {
			id: "3",
			name: "Bek Temirov",
			image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=3",
		},
	},
	{
		id: "4",
		name: "Bug Fixes",
		startAt: startOfMonth(subMonths(today, 1)),
		endAt: subDays(endOfMonth(today), 5),
		status: exampleStatuses[4],
		owner: {
			id: "4",
			name: "Laylo Rakhimova",
			image: "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=4",
		},
	},
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
});

export default function TasksPage() {
	const [tasks, setTasks] = useState(initialTasks);
	const t = useTranslation();

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;

		const newStatus = exampleStatuses.find((s) => s.id === over.id);
		if (!newStatus) return;

		setTasks(
			tasks.map((task) => (task.id === active.id ? { ...task, status: newStatus } : task))
		);
	};

	return (
		<KanbanProvider onDragEnd={handleDragEnd} className="flex flex-col p-6 w-full space-y-4 h-full">
			<h1 className="text-3xl font-bold">{t("tasks")}</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 h-full">
				{exampleStatuses.map((status) => (
					<KanbanBoard key={status.id} id={status.id} className="h-full">
						<KanbanHeader name={t(status.id)} color={status.color} />
						<KanbanCards>
							{tasks
								.filter((task) => task.status.id === status.id)
								.map((task, index) => (
									<KanbanCard
										key={task.id}
										id={task.id}
										name={task.name}
										parent={status.id}
										index={index}
									>
										<div className="flex items-center justify-between">
											<div className="text-sm font-medium">{task.name}</div>
										</div>
										<div className="text-xs text-muted-foreground">
											{shortDateFormatter.format(task.startAt)} -{" "}
											{dateFormatter.format(task.endAt)}
										</div>
									</KanbanCard>
								))}
						</KanbanCards>
					</KanbanBoard>
				))}
			</div>
		</KanbanProvider>
	);
}
