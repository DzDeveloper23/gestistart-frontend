export interface Client {
  _id: string;
  nomContact: string;
  nomEntreprise: string;
  email: string;
  telephone?: string;
  adresse?: string;
  notes?: string;
  status: 'Actif' | 'Inactif' | 'Prospect';
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientFormData {
  nomContact: string;
  nomEntreprise: string;
  email: string;
  telephone?: string;
  adresse?: string;
  notes?: string;
  status?: 'Actif' | 'Inactif' | 'Prospect';
}
