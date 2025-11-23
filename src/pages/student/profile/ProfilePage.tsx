;

import { Loader2, Mail, Phone, MapPin, Edit, User2 } from "lucide-react";
import { useStudentData } from '@/context/StudentDataContext';
import { useState } from "react";
import { ProfileForm } from "@/components/Form/ProfileForm";
import type { payloadUser, StudentType } from "@/types/user";
import { Button } from "@/components/ui/button";


export default function ProfilePage() {
    const { studentData, isLoading, isError, refetch } = useStudentData();
    const [editingItem, setEditingItem] = useState<StudentType | null>(null);
    const [formOpen, setFormOpen] = useState(false);

    const defaultForm: payloadUser = {
        first_name: '',
        last_name: '',
        email: null,
        phone: null,
        address: null,
        password: '',
        role: 'student',
    };

    const [form, setForm] = useState<payloadUser>(defaultForm);

    const openEdit = (t: any) => {
        setEditingItem(t);
        setForm({
            id: t.id,
            cover: t.cover,
            first_name: t.first_name,
            last_name: t.last_name,
            email: t.email,
            phone: t.phone,
            password: '',
            address: t.address,
        });
        setFormOpen(true);
    };

    const handleFormSuccess = () => {
        setFormOpen(false);
        setEditingItem(null);
    };

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="ml-2 text-gray-600">Loading your profile...</span>
            </div>
        );

    if (isError)
        return (
            <div className="text-center text-red-500 font-medium py-10">
                Something went wrong. Please refresh or try again later.
            </div>
        );

    return (
        <>
            <div className="mt-10 max-w-5xl w-full bg-white/50 rounded-2xl shadow-xl backdrop-blur-md p-8">
                <div className=" flex flex-col md:flex-row items-center md:items-start gap-12">
                    <div className="relative w-36 h-32 rounded-2xl overflow-hidden shadow border border-gray-200 bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        {studentData?.cover ? (
                            <img
                                src={studentData?.cover as any}
                                alt={studentData?.first_name || 'User Image'}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-5xl font-bold text-primary opacity-60 group-hover:scale-110 transition-transform">{(studentData?.first_name?.[0] ?? 'C').toUpperCase()}</span>
                        )}
                    </div>
                    <div className=" flex-1 text-center md:text-left">
                        <div className=" md:flex justify-between items-center mt-6">
                            <div>
                                <p className=" text-gray-500 text-xl font-medium">
                                    My Profile
                                </p>
                                <h2 className=" text-3xl font-semibold text-primary">
                                    {studentData?.first_name} {studentData?.last_name}
                                </h2>

                            </div>


                            <Button variant="default" className="py-4" onClick={() => openEdit(studentData)}>
                                <Edit className=" size-4.5 transition-all duration-300 ease-in-out " />
                            </Button>
                        </div>






                    </div>
                </div>
                <div className=" flex flex-wrap flex-col justify-center md:justify-start gap-3 mt-4">
                    <span className="inline-flex items-center text-sm gap-6 text-gray-700 bg-gray-100 px-3 py-2 rounded-full">
                        <User2 className="w-4 h-4 text-primary" />
                        {studentData?.first_name || "No Name"} {studentData?.last_name || null}
                    </span>
                    <span className="inline-flex items-center text-sm gap-6 text-gray-700 bg-gray-100 px-3 py-2 rounded-full">
                        <Mail className="w-4 h-4 text-primary" />
                        {studentData?.email || "No email"}
                    </span>
                    <span className="inline-flex text-sm items-center gap-6 text-gray-700 bg-gray-100 px-3 py-2 rounded-full">
                        <Phone className="w-4 h-4 text-primary" />
                        {studentData?.phone || "No phone"}
                    </span>
                    {studentData?.address && (
                        <span className="inline-flex items-center gap-6 text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-full">
                            <MapPin className="w-4 h-4 text-primary" />
                            {studentData.address}
                        </span>
                    )}
                </div>

                <ProfileForm open={formOpen} onOpenChange={setFormOpen} editingItem={editingItem} form={form} setForm={setForm} onSuccess={handleFormSuccess} refetch={refetch} />





            </div>
        </>
    )
}