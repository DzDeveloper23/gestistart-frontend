export interface Employee {
  _id: string;
  userId: {
    _id: string;
    email: string;
    nom: string;
  };
  nom: string;
  email: string;
  poste: string;
  role: 'Admin' | 'Manager' | 'Employé';
  salaire: number;
  status: 'Actif' | 'Inactif' | 'Congé';
  dateEmbauche: Date;
  projectsAssignes: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeFormData {
  userId: string;
  poste: string;
  role?: 'Admin' | 'Manager' | 'Employé';
  salaire?: number;
  dateEmbauche: Date;
}
