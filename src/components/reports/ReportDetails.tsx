import { Card } from "../ui/card";
import { TransactionReport, columns } from "./transactions-list/columns";
import { DataTable } from "../common/table/data-table";
interface TransactionReportListProps {
  data: TransactionReport[] | any[];
}
export function ReportDetails(props: TransactionReportListProps) {
  return (
    <Card className="p-2">
      <DataTable columns={columns} data={props.data} />
    </Card>
  );
}
