import { Download, FileText, Database, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

const exportItems = [
  {
    id: 'predictions',
    title: 'Predictions Export',
    description: 'Complete Scope 1 & 2 emission predictions for all entities',
    format: 'CSV',
    size: '2.4 MB',
    records: '10,247 entities',
    status: 'ready',
  },
  {
    id: 'dataset',
    title: 'Full Dataset',
    description: 'Raw dataset with all features and targets',
    format: 'CSV',
    size: '8.7 MB',
    records: '10,247 rows × 45 columns',
    status: 'ready',
  },
  {
    id: 'submission',
    title: 'Competition Submission',
    description: 'Official submission.csv for model evaluation',
    format: 'CSV',
    size: '1.1 MB',
    records: 'Test set predictions',
    status: 'ready',
  },
  {
    id: 'model-report',
    title: 'Model Performance Report',
    description: 'Comprehensive analysis of model metrics and explanations',
    format: 'PDF',
    size: '4.2 MB',
    records: 'Full technical report',
    status: 'ready',
  },
  {
    id: 'entity-analysis',
    title: 'Entity Analysis Report',
    description: 'Detailed breakdowns for top 100 entities',
    format: 'PDF',
    size: '12.5 MB',
    records: '100 entities',
    status: 'generating',
  },
  {
    id: 'benchmark',
    title: 'Benchmark Data',
    description: 'Sector and regional emission benchmarks',
    format: 'JSON',
    size: '890 KB',
    records: 'Aggregated statistics',
    status: 'ready',
  },
];

const qualityMetrics = [
  { label: 'Completeness', value: 100, status: 'excellent' },
  { label: 'Missing Values', value: 0, status: 'excellent' },
  { label: 'Format Validation', value: 100, status: 'excellent' },
  { label: 'Range Validation', value: 98, status: 'good' },
  { label: 'Consistency Check', value: 97, status: 'good' },
];

export function ExportsReports() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-white text-3xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
          Exports & Reports
        </h1>
        <p className="text-[#AFAFAF]" style={{ fontWeight: 300 }}>
          Download predictions, datasets, and generate comprehensive reports
        </p>
      </div>

      {/* Quality Check Panel */}
      <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A]">
        <div className="flex items-center space-x-3 mb-6">
          <CheckCircle className="w-6 h-6 text-white" />
          <h2 className="text-white text-xl" style={{ fontWeight: 700 }}>
            Data Quality Assessment
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {qualityMetrics.map((metric) => (
            <div key={metric.label} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[#AFAFAF] text-sm" style={{ fontWeight: 500 }}>
                  {metric.label}
                </p>
                {metric.status === 'excellent' ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#AFAFAF]" />
                )}
              </div>
              <div className="space-y-2">
                <Progress value={metric.value} className="h-2" />
                <p className="text-white text-2xl" style={{ fontWeight: 700 }}>
                  {metric.value}%
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-[#0D0D0D] rounded-xl border border-[#2A2A2A]">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-white mt-0.5" />
            <div>
              <p className="text-white mb-1" style={{ fontWeight: 600 }}>
                All validation checks passed
              </p>
              <p className="text-[#AFAFAF] text-sm" style={{ fontWeight: 300 }}>
                Your submission is ready for export. All predictions meet competition requirements 
                and data quality standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exportItems.map((item) => (
          <div 
            key={item.id}
            className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A] hover:border-[#4E4E4E] transition-all"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-3">
                <div className="p-3 bg-[#2A2A2A] rounded-xl">
                  {item.format === 'PDF' ? (
                    <FileText className="w-6 h-6 text-white" />
                  ) : (
                    <Database className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-white mb-1" style={{ fontWeight: 700 }}>
                    {item.title}
                  </h3>
                  <p className="text-[#AFAFAF] text-sm" style={{ fontWeight: 300 }}>
                    {item.description}
                  </p>
                </div>
              </div>
              <Badge 
                className={`${
                  item.status === 'ready' 
                    ? 'bg-white text-black' 
                    : 'bg-[#2A2A2A] text-[#AFAFAF]'
                } border-none`}
                style={{ fontWeight: 600 }}
              >
                {item.status === 'ready' ? 'READY' : 'GENERATING'}
              </Badge>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#AFAFAF]" style={{ fontWeight: 500 }}>Format:</span>
                <span className="text-white" style={{ fontWeight: 600 }}>{item.format}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#AFAFAF]" style={{ fontWeight: 500 }}>File Size:</span>
                <span className="text-white" style={{ fontWeight: 600 }}>{item.size}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#AFAFAF]" style={{ fontWeight: 500 }}>Records:</span>
                <span className="text-white" style={{ fontWeight: 600 }}>{item.records}</span>
              </div>
            </div>

            <Button
              disabled={item.status === 'generating'}
              className={`w-full rounded-xl h-11 ${
                item.status === 'ready'
                  ? 'bg-white text-black hover:bg-[#AFAFAF]'
                  : 'bg-[#2A2A2A] text-[#AFAFAF] cursor-not-allowed'
              }`}
              style={{ fontWeight: 600 }}
            >
              {item.status === 'ready' ? (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download {item.format}
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A]">
        <h2 className="text-white text-xl mb-6" style={{ fontWeight: 700 }}>
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline"
            className="h-auto py-4 border-[#2A2A2A] hover:bg-[#2A2A2A] rounded-xl flex-col items-start space-y-2"
          >
            <div className="flex items-center space-x-2 text-white">
              <FileText className="w-5 h-5" />
              <span style={{ fontWeight: 600 }}>Generate Custom Report</span>
            </div>
            <p className="text-[#AFAFAF] text-xs text-left" style={{ fontWeight: 300 }}>
              Create a tailored analysis report for specific entities or sectors
            </p>
          </Button>

          <Button 
            variant="outline"
            className="h-auto py-4 border-[#2A2A2A] hover:bg-[#2A2A2A] rounded-xl flex-col items-start space-y-2"
          >
            <div className="flex items-center space-x-2 text-white">
              <Download className="w-5 h-5" />
              <span style={{ fontWeight: 600 }}>Bulk Download</span>
            </div>
            <p className="text-[#AFAFAF] text-xs text-left" style={{ fontWeight: 300 }}>
              Download all available exports in a single compressed archive
            </p>
          </Button>

          <Button 
            variant="outline"
            className="h-auto py-4 border-[#2A2A2A] hover:bg-[#2A2A2A] rounded-xl flex-col items-start space-y-2"
          >
            <div className="flex items-center space-x-2 text-white">
              <Database className="w-5 h-5" />
              <span style={{ fontWeight: 600 }}>API Access</span>
            </div>
            <p className="text-[#AFAFAF] text-xs text-left" style={{ fontWeight: 300 }}>
              Access predictions programmatically via REST API endpoints
            </p>
          </Button>
        </div>
      </div>

      {/* Export History */}
      <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A]">
        <h2 className="text-white text-xl mb-6" style={{ fontWeight: 700 }}>
          Recent Exports
        </h2>

        <div className="space-y-3">
          {[
            { name: 'submission.csv', time: '2 hours ago', size: '1.1 MB' },
            { name: 'predictions_full.csv', time: '5 hours ago', size: '2.4 MB' },
            { name: 'model_report.pdf', time: '1 day ago', size: '4.2 MB' },
          ].map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-xl border border-[#2A2A2A] hover:border-[#4E4E4E] transition-all cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-[#AFAFAF]" />
                <div>
                  <p className="text-white" style={{ fontWeight: 600 }}>{item.name}</p>
                  <p className="text-[#AFAFAF] text-xs" style={{ fontWeight: 300 }}>
                    {item.time} • {item.size}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-[#AFAFAF] hover:text-white hover:bg-[#2A2A2A]"
              >
                Download Again
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
