'use client';

import { FileSpreadsheet, FileText, Table2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EXPORTS = [
  {
    id: 'pdf',
    label: 'PDF Export',
    description: 'Executive summary report with charts',
    icon: FileText,
    accent: 'from-erp-accent/20 to-transparent',
  },
  {
    id: 'excel',
    label: 'Excel Export',
    description: 'Full data workbook with pivot tables',
    icon: FileSpreadsheet,
    accent: 'from-erp-success/20 to-transparent',
  },
  {
    id: 'csv',
    label: 'CSV Export',
    description: 'Raw data for external analysis',
    icon: Table2,
    accent: 'from-erp-warning/20 to-transparent',
  },
] as const;

export function ExportSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
    >
      <Card className="erp-glass overflow-hidden">
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
          <p className="text-sm text-erp-muted">Download manufacturing analytics in your preferred format</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {EXPORTS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className={`group relative overflow-hidden rounded-2xl border border-erp-border bg-gradient-to-br ${item.accent} p-6 transition-all hover:border-erp-accent/30 hover:shadow-erp-hover`}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-erp-card ring-1 ring-erp-border transition-all group-hover:ring-erp-accent/30">
                  <item.icon className="h-6 w-6 text-erp-accent" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold text-erp-text">{item.label}</h3>
                <p className="mt-1 text-sm text-erp-muted">{item.description}</p>
                <Button variant="ghost" size="sm" className="mt-5 w-full">
                  Download {item.label.split(' ')[0]}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
