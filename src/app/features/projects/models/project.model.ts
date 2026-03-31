export interface Project {
  _id: string;
  titre: string;
  description?: string;
  clientId: {
    _id: string;
    nomEntreprise: string;
    email: string;
  };
  team: any[];
  status: 'En cours' | 'En attente' | 'Terminé' | 'Suspendu';
  budget: number;
  montantUtilise: number;
  dateDebut: Date;
  dateFin: Date;
  priorite: 'Basse' | 'Moyenne' | 'Haute' | 'Critique';
  notes?: string;
  createdBy: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFormData {
  titre: string;
  description?: string;
  clientId: string;
  budget: number;
  dateDebut: Date;
  dateFin: Date;
  priorite: 'Basse' | 'Moyenne' | 'Haute' | 'Critique';
  notes?: string;
  team?: string[];
}
