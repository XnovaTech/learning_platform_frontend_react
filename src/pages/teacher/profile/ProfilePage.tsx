import { useState } from 'react';
import type { payloadUser, TeacherType } from '../../../types/user';
import { Edit, Mail, Phone, MapPin, User, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileForm } from '@/components/Form/ProfileForm';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { user, fetchProfile, token } = useAuth();
  const [editingItem, setEditingItem] = useState<TeacherType | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const refetch = () => fetchProfile(token ?? '');

  const defaultForm: payloadUser = {
    first_name: '',
    last_name: '',
    email: null,
    phone: null,
    address: null,
    password: '',
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

  const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors">
      <div className="mt-0.5 p-2 rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-sm text-gray-900 break-words">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden shadow bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                {user?.cover ? (
                  <img src={user?.cover as any} alt={user?.first_name || 'User Image'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-primary opacity-60 group-hover:scale-110 transition-transform">{(user?.first_name?.[0] ?? 'C').toUpperCase()}</span>
                )}
              </div>

              <CardContent className=" pb-4 lg:pb-3 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {user.first_name} {user.last_name}
                </h2>

                <div className="flex items-center justify-center gap-2 mb-6">
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    {user.roles?.[0] || 'User'}
                  </Badge>
                </div>

                <Button onClick={() => openEdit(user)} className="w-full rounded-xl  " size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center  ml-3 gap-2">
                  <User className="h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoItem icon={Mail} label="Email" value={user.email} />
                <InfoItem icon={Phone} label="Phone" value={user.phone} />
                <InfoItem icon={MapPin} label="Address" value={user.address} />
              </CardContent>
            </Card>
          </div>
        </div>

        <ProfileForm open={formOpen} onOpenChange={setFormOpen} editingItem={editingItem} form={form} setForm={setForm} onSuccess={handleFormSuccess} refetch={refetch} />
      </div>
    </div>
  );
}
