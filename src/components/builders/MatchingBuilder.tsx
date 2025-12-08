import  {useState, useEffect} from "react";
import type { MatchingExtraData } from "@/types/task";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Trash2, GripVertical } from "lucide-react";

type Props = {
    initial?: MatchingExtraData | null;
    onChange: (data: MatchingExtraData) => void;
};

function SortableItem({id, value, onChange, onRemove}: any){
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-2">
            <div {...attributes} {...listeners} className="p-2">
                 <GripVertical/>
            </div>
            <Input value={value} onChange={(e) => onChange(e.target.value)}/>
            <Button variant="ghost" onClick={onRemove}><Trash2/></Button>
        </div>
    )
}

export default function MatchingBuilder ({initial, onChange}: Props){
    const [left, setLeft] = useState<string[]>(initial?.left ?? []);
    const [right, setRight] = useState<string[]>(initial?.right ?? []);

    useEffect(() => {
        onChange({left, right, matches:{}});
    }, [left, right]);

    const handleAddLeft = () => setLeft((s) => [...s, ""]);
    const handleAddRight = () => setRight((s) => [...s, ""]);

    const handleRemoveLeft = (idx:number) => setLeft((s) => s.filter((_, i) => i !== idx));
    const handleRemoveRight = (idx: number) => setRight((s) => s.filter((_, i) => i !== idx));

    const handleLeftChange = (idx: number, val: string) =>
        setLeft ((s) => s.map((it, i) => (i === idx ? val : it)));

    const handleRightChange = (idx: number, val: string) =>
        setRight ((s) => s.map((it, i) => (i === idx ? val : it)));

    const handleDragEndLeft = (event: any) => {
        const {active, over} = event;
        if (!over || active.id === over.id) return;
        const oldIndex = Number(active.id.split("-")[1]);
        const newIndex = Number(over.id.split("-")[1]);
        setLeft((items) => arrayMove(items, oldIndex, newIndex));
    }

    const handleDragEndRight = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = Number(active.id.split("-")[1]);
        const newIndex = Number(over.id.split("-")[1]);
        setRight((items) => arrayMove(items, oldIndex, newIndex));
    };

    return (
        <div className=" grid grid-cols-2 gap-4">
            <div>
                <div className=" flex items-center justify-between mb-2">
                    <div className="font-medium">Left Items</div>
                    <Button size="sm" onClick={handleAddLeft}>Add</Button>
                </div>

                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEndLeft}>
                    <SortableContext items={left.map((_, i) => `L-${i}`)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            {left.map((val, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <SortableItem
                                        id={`L-${idx}`}
                                        value={val}
                                        onChange={(v: string) => handleLeftChange(idx, v)}
                                        onRemove = {() => handleRemoveLeft(idx)}
                                    />
                                </div>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            <div>
                <div className=" flex items-center justify-between mb-2">
                    <div className="font-medium">
                        Right Items
                    </div>
                    <Button size="sm" onClick={handleAddRight}>Add</Button>
                </div>

                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEndRight}>
                    <SortableContext items={right.map((_, i) => `R-${i}`)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                        {right.map((val, idx) => (
                            <SortableItem
                            key={idx}
                            id={`R-${idx}`}
                            value={val}
                            onChange={(v: string) => handleRightChange(idx, v)}
                            onRemove={() => handleRemoveRight(idx)}
                            />
                        ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    )
}
