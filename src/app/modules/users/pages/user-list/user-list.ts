import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Users } from '../../../../core/services/users';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  private usersService = inject(Users);

  users: User[] = [];
  isLoading = true;
  isEditing = false;

  // Objeto vinculado al modal mediante [(ngModel)]
  selectedUser: any = { 
    id: null, 
    username: '', 
    email: '', 
    role: 'ESTUDIANTE' 
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Obtiene la lista de usuarios desde el Backend
   */
  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.isLoading = false;
      }
    });
  }

  prepareNewUser(): void {
    this.isEditing = false;
    this.selectedUser = { id: null, username: '', email: '', role: 'ESTUDIANTE' };
  }

  editUser(user: User): void {
    this.isEditing = true;
    this.selectedUser = { ...user };
  }

  /**
   * Lógica de Guardado Conectada a la API REST
   */
  saveUser(event: Event): void {
    event.preventDefault();

    if (this.isEditing) {
      // --- ACTUALIZAR USUARIO (PUT) ---
      this.usersService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
          }
          this.closeModalAndReset('Usuario actualizado correctamente');
        },
        error: () => alert('Error al actualizar el usuario en el servidor')
      });
    } else {
      // --- CREAR USUARIO (POST) ---
      this.usersService.createUser(this.selectedUser).subscribe({
        next: (newUser) => {
          this.users.push(newUser);
          this.closeModalAndReset('Usuario registrado con éxito');
        },
        error: () => alert('Error al registrar el usuario en el servidor')
      });
    }
  }

  /**
   * Cierra el modal y limpia el formulario
   */
  private closeModalAndReset(message: string): void {
    alert(message);
    document.getElementById('closeUserModal')?.click();
    this.prepareNewUser();
  }

  /**
   * Elimina un usuario del sistema
   */
  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          // Eliminamos de la lista local solo después de que el server confirme
          this.users = this.users.filter(u => u.id !== id);
        },
        error: () => {
          this.users = this.users.filter(u => u.id !== id);
          console.warn('Eliminado localmente debido a error de conexión.');
        }
      });
    }
  }
}