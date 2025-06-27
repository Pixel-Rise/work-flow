import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  DndContext,
  rectIntersection,
  useDraggable,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { ReactNode } from 'react';
import { useState } from 'react';

export type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

export type Status = {
  id: string;
  name: string;
  color: string;
};

export type Feature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: Status;
};

export type KanbanBoardProps = {
  id: Status['id'];
  children: ReactNode;
  className?: string;
};

export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      className={cn(
        'flex h-full min-h-40 flex-col gap-2 rounded-md border bg-secondary p-2 text-xs shadow-sm transition-all relative',
        isOver ? 'outline-2 outline-primary' : '',
        className
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
};

export type KanbanCardProps = Pick<Feature, 'id' | 'name'> & {
  index: number;
  parent: string;
  children?: ReactNode;
  className?: string;
};

export const KanbanCard = ({
  id,
  name,
  index,
  parent,
  children,
  className,
}: KanbanCardProps) => {
  const { attributes, listeners, setNodeRef, isDragging } =
    useDraggable({
      id,
      data: { index, parent },
    });

  return (
    <Card
      className={cn(
        'rounded-md p-3 shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-30 scale-95',
        className
      )}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
    </Card>
  );
};

export type KanbanCardsProps = {
  children: ReactNode;
  className?: string;
};

export const KanbanCards = ({ children, className }: KanbanCardsProps) => (
  <div className={cn('flex flex-1 flex-col gap-2 relative', className)}>{children}</div>
);

export type KanbanHeaderProps =
  | {
      children: ReactNode;
    }
  | {
      name: Status['name'];
      color: Status['color'];
      className?: string;
    };

export const KanbanHeader = (props: KanbanHeaderProps) =>
  'children' in props ? (
    props.children
  ) : (
    <div className={cn('flex shrink-0 items-center gap-2', props.className)}>
      <div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: props.color }}
      />
      <p className="m-0 font-semibold text-sm">{props.name}</p>
    </div>
  );

export type KanbanProviderProps = {
  children: ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
  onDragStart?: (event: DragStartEvent) => void;
  className?: string;
};

export const KanbanProvider = ({
  children,
  onDragEnd,
  onDragStart,
  className,
}: KanbanProviderProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    onDragStart?.(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    onDragEnd(event);
  };

  return (
    <DndContext 
      collisionDetection={rectIntersection} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className={cn('grid w-full auto-cols-fr grid-flow-col gap-4', className)}
      >
        {children}
      </div>
      <DragOverlay>
        {activeId ? (
          <Card className="rounded-md p-3 shadow-xl cursor-grabbing opacity-95 z-50 border-2 border-primary bg-background">
            <p className="m-0 font-medium text-sm">Moving card...</p>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
