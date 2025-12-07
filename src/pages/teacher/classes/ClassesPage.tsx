import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { listCategories } from '@/services/categoryService';
import { getClassesByCategory } from '@/services/classService';
import type { CategoryType } from '@/types/category';
import ClassRoomTable from '@/components/Table/ClassRoomTable';
import { Button } from '@/components/ui/button';

export default function ClassesPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return await listCategories();
    },
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });

  const { data: classRooms, isLoading } = useQuery({
    queryKey: ['classes', { categoryId: selectedCategoryId }],
    queryFn: async () => {
      if (!selectedCategoryId) return [];
      return await getClassesByCategory(Number(selectedCategoryId));
    },
    staleTime: 20_000,
    refetchOnWindowFocus: false,
    enabled: !!selectedCategoryId,
  });

  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(String(categories[0].id));
    }
  }, [categories, selectedCategoryId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Active Classes</h2>
          <p className="text-muted-foreground text-sm">Browse and manage classes by category.</p>
        </div>

        {(classRooms?.length ?? 0) > 0 && (
          <Button className="rounded-full hidden md:flex">
            Classes :<span>{classRooms?.length}</span>
          </Button>
        )}
      </div>
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur overflow-hidden">
        {categoriesLoading ? (
          <div className="flex items-center justify-center py-14">
            <Spinner className="text-primary size-7 md:size-8" />
          </div>
        ) : categories?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-primary/90 p-4 mb-4">
              <BookOpen className="size-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-1">No categories available</h4>
            <p className="text-sm text-muted-foreground mb-4">Create a category to get started</p>
          </div>
        ) : (
          <Tabs value={selectedCategoryId} onValueChange={setSelectedCategoryId} className="w-full">
            <div className="border-b bg-gradient-to-r from-slate-50 to-slate-100/50 px-5 pb-4">
              <TabsList className="rounded-2xl bg-white shadow h-11">
                {categories?.map((category: CategoryType) => (
                  <TabsTrigger
                    key={category.id}
                    value={String(category.id)}
                    className="rounded-xl transition-all capitalize duration-300 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6"
                  >
                    <span className="font-medium">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={selectedCategoryId} className="p-5 space-y-6 mt-0">
              <div className="overflow-x-auto rounded-md ">
                {isLoading ? (
                  <div className="flex items-center justify-center py-14">
                    <Spinner className="text-primary size-7 md:size-8" />
                  </div>
                ) : (
                  <ClassRoomTable classrooms={classRooms || []} />
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </Card>
    </div>
  );
}
