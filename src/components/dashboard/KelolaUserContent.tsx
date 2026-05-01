"use client"

import { useState } from 'react';
import { UserPlus, Trash2, Shield, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function KelolaUserContent() {
  const [users, setUsers] = useState([
    { id: '1', name: 'Admin Utama', email: 'admin@pelabuhan.go.id', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Budi Santoso', email: 'budi.ops@gmail.com', role: 'Operator', status: 'Active' },
    { id: '3', name: 'Siti Aminah', email: 'siti.viewer@outlook.com', role: 'Viewer', status: 'Active' },
    { id: '4', name: 'Agus Salim', email: 'agus.test@pelabuhan.go.id', role: 'Operator', status: 'Inactive' },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Kelola Pengguna</h1>
          <p className="text-muted-foreground mt-1">Manajemen akses dan hak istimewa pengguna sistem.</p>
        </div>
        
        <Button className="h-10 shadow-lg shadow-primary/20">
          <UserPlus className="h-4 w-4 mr-2" />
          Tambah User Baru
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Daftar Pengguna Sistem</CardTitle>
          <CardDescription>Kelola peran (RBAC) dan status aktifasi user.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold">Nama Lengkap</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">Role</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-center font-bold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-bold text-slate-800">{user.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'} className="rounded-md px-2 py-0.5">
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {user.status === 'Active' ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm font-medium text-emerald-600">Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-400">Non-aktif</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 text-blue-500 hover:bg-blue-50">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
