export enum MaterialStatus {
  PENDENTE = 'pendente',
  COMPRADO = 'comprado',
  CANCELADO = 'cancelado',
}

export const MATERIAL_STATUS_LABELS: Record<MaterialStatus, string> = {
  [MaterialStatus.PENDENTE]: 'Pendente',
  [MaterialStatus.COMPRADO]: 'Comprado',
  [MaterialStatus.CANCELADO]: 'Cancelado',
};
