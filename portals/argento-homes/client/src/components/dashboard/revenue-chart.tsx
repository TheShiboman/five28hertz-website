import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps 
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface RevenueData {
  name: string;
  value: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  currentMonth: {
    value: number;
  };
  lastMonth: {
    value: number;
  };
  growth: string;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 shadow-sm rounded">
        <p className="font-medium">{label}</p>
        <p className="text-blue-500">{formatCurrency(payload[0].value as number)}</p>
      </div>
    );
  }

  return null;
};

const RevenueChart = ({ data, currentMonth, lastMonth, growth }: RevenueChartProps) => {
  return (
    <Card>
      <CardContent className="pt-5">
        <h3 className="text-lg font-semibold text-charcoal mb-5">Monthly Revenue</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${value/1000}k`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3498DB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center mt-4">
          <div>
            <div className="text-sm text-gray-500">This Month</div>
            <div className="font-semibold text-charcoal">{formatCurrency(currentMonth.value)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Last Month</div>
            <div className="font-semibold text-charcoal">{formatCurrency(lastMonth.value)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Growth</div>
            <div className="font-semibold text-emerald-500">{growth}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
