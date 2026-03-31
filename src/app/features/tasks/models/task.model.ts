export interface Task {
  _id: string;
  titre: string;
  description?: string;
  projectId: {
    _id: string;
    titre: string;
  };
  assigneId?: {
    _id: string;
    nom: string;
    email: string;
  };
  status: 'À faire' | 'En cours' | 'En révision' | 'Terminée';
  priorite: 'Basse' | 'Moyenne' | 'Haute' | 'Critique';
  dateEcheance?: Date;
  piecesJointes: {
    _id: string;
    nom: string;
    url: string;
    uploadedAt: Date;
  }[];
  commentaires: {
    _id: string;
    userId: {
      _id: string;
      nom: string;
      email: string;
    };
    texte: string;
    createdAt: Date;
  }[];
  createdBy: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  titre: string;
  description?: string;
  projectId: string;
  assigneId?: string;
  priorite: 'Basse' | 'Moyenne' | 'Haute' | 'Critique';
  dateEcheance?: Date;
}
