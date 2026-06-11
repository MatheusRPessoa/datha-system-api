export enum OrderStage {
  ATENDIMENTO = 'atendimento',
  MONTAGEM = 'montagem',
  IMPRESSAO = 'impressao',
  PRODUCAO = 'producao',
  ACABAMENTO = 'acabamento',
  ENTREGA = 'entrega',
}

export const ORDER_STAGE_SEQUENCE: OrderStage[] = [
  OrderStage.ATENDIMENTO,
  OrderStage.MONTAGEM,
  OrderStage.IMPRESSAO,
  OrderStage.PRODUCAO,
  OrderStage.ACABAMENTO,
  OrderStage.ENTREGA,
];

export const ORDER_STAGE_LABELS: Record<OrderStage, string> = {
  [OrderStage.ATENDIMENTO]: 'Atendimento',
  [OrderStage.MONTAGEM]: 'Montagem de arquivo',
  [OrderStage.IMPRESSAO]: 'Impressão',
  [OrderStage.PRODUCAO]: 'Produção',
  [OrderStage.ACABAMENTO]: 'Acabamento',
  [OrderStage.ENTREGA]: 'Entrega disponível',
};
