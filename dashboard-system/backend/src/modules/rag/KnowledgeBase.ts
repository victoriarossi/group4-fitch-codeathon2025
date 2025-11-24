import fs from 'fs';
import path from 'path';

interface KnowledgeDocument {
  id: number;
  title: string;
  content: string;
  docType: string;
  source: string;
  contributor: 'Maria' | 'Victoria';
}

/**
 * Loads and parses knowledge base documents from project files
 * Sources organized by contributor:
 * - Maria: Phases 4-7 pipeline (built on Victoria's Phase 1-3 work)
 * - Victoria: Complete pipeline notebook, logs, and predictions
 */
export class KnowledgeBase {
  private documents: KnowledgeDocument[] = [];

  constructor() {
    this.loadDocuments();
  }

  private loadDocuments(): void {
    try {
      // Load Maria's work (Phases 4-7)
      const mariaDocs = this.loadMariaWork();
      this.documents.push(...mariaDocs);

      // Load Victoria's work (notebook, logs, predictions)
      const victoriaDocs = this.loadVictoriaWork();
      this.documents.push(...victoriaDocs);

      // Load supporting documents (dataset analysis, imputation logs)
      const supportingDocs = this.loadSupportingDocs();
      this.documents.push(...supportingDocs);

      console.log(`✓ Loaded ${this.documents.length} knowledge base documents`);
      const mariaCount = this.documents.filter(d => d.contributor === 'Maria').length;
      const victoriaCount = this.documents.filter(d => d.contributor === 'Victoria').length;
      const supportingCount = supportingDocs.length;
      console.log(`  - Maria's work: ${mariaCount} documents`);
      console.log(`  - Victoria's work: ${victoriaCount} documents`);
      console.log(`  - Supporting docs: ${supportingCount} documents`);
    } catch (error) {
      console.error('Error loading knowledge base:', error);
    }
  }

  private loadMariaWork(): KnowledgeDocument[] {
    const docs: KnowledgeDocument[] = [];
    const basePath = path.join(__dirname, '../../../knowledge-base/maria');

    try {
      // Load Maria's pipeline markdown
      const mdPath = path.join(basePath, 'MariasFindingPipeline.md');
      const content = fs.readFileSync(mdPath, 'utf-8');

      docs.push({
        id: 1,
        title: "Maria's Pipeline: Phases 4-7 (Built on Victoria's Phase 1-3)",
        content: content,
        docType: 'methodology',
        source: 'MariasFindingPipeline.md',
        contributor: 'Maria'
      });
    } catch (error) {
      console.warn('Could not load Maria\'s pipeline:', error);
    }

    return docs;
  }

  private loadVictoriaWork(): KnowledgeDocument[] {
    const docs: KnowledgeDocument[] = [];
    const basePath = path.join(__dirname, '../../../knowledge-base/victoria');
    let docId = 1000; // Start Victoria's IDs at 1000

    try {
      // 1. Load Victoria's notebook
      const notebookPath = path.join(basePath, 'fitch_codeathon_pipeline.ipynb');
      if (fs.existsSync(notebookPath)) {
        const notebookContent = fs.readFileSync(notebookPath, 'utf-8');
        const notebook = JSON.parse(notebookContent);

        // Extract markdown cells as documentation sections
        const markdownCells = notebook.cells?.filter((cell: any) => 
          cell.cell_type === 'markdown'
        ) || [];

        // Group cells into logical sections
        let currentSection: { title: string; content: string[] } | null = null;
        const sections: Array<{ title: string; content: string }> = [];

        for (const cell of markdownCells) {
          const text = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
          
          // Check if this is a heading (section start)
          if (text.startsWith('# ') || text.startsWith('## ')) {
            // Save previous section
            if (currentSection && currentSection.content.length > 0) {
              sections.push({
                title: currentSection.title,
                content: currentSection.content.join('\n\n')
              });
            }
            
            // Start new section
            const title = text.replace(/^#+\s*/, '').split('\n')[0].trim();
            currentSection = { title, content: [text] };
          } else if (currentSection) {
            // Add to current section
            currentSection.content.push(text);
          }
        }

        // Add last section
        if (currentSection && currentSection.content.length > 0) {
          sections.push({
            title: currentSection.title,
            content: currentSection.content.join('\n\n')
          });
        }

        // Convert sections to documents
        for (const section of sections) {
          docs.push({
            id: docId++,
            title: `Victoria's Notebook: ${section.title}`,
            content: section.content,
            docType: this.categorizeSection(section.title),
            source: 'fitch_codeathon_pipeline.ipynb',
            contributor: 'Victoria'
          });
        }
      }

      // 2. Load KNN SDG imputation log
      const knnLogPath = path.join(basePath, 'knn_sdg_imputation_log.txt');
      if (fs.existsSync(knnLogPath)) {
        const content = fs.readFileSync(knnLogPath, 'utf-8');
        docs.push({
          id: docId++,
          title: "Victoria's KNN SDG Imputation Log",
          content: content,
          docType: 'imputation-log',
          source: 'knn_sdg_imputation_log.txt',
          contributor: 'Victoria'
        });
      }

      // 3. Load model training log
      const modelLogPath = path.join(basePath, 'model_training_log.txt');
      if (fs.existsSync(modelLogPath)) {
        const content = fs.readFileSync(modelLogPath, 'utf-8');
        docs.push({
          id: docId++,
          title: "Victoria's Model Training Log",
          content: content,
          docType: 'training-log',
          source: 'model_training_log.txt',
          contributor: 'Victoria'
        });
      }

      // 4. Load test predictions CSV (convert to text summary)
      const predictionsPath = path.join(basePath, 'test_predictions.csv');
      if (fs.existsSync(predictionsPath)) {
        const csvContent = fs.readFileSync(predictionsPath, 'utf-8');
        const lines = csvContent.split('\n');
        const header = lines[0];
        const sampleRows = lines.slice(1, 11).join('\n'); // First 10 rows
        
        const summary = `Victoria's Test Predictions (CSV)\n\nHeader: ${header}\n\nSample Data (first 10 rows):\n${sampleRows}\n\nTotal predictions: ${lines.length - 1} rows`;
        
        docs.push({
          id: docId++,
          title: "Victoria's Test Predictions",
          content: summary,
          docType: 'predictions',
          source: 'test_predictions.csv',
          contributor: 'Victoria'
        });
      }

    } catch (error) {
      console.warn('Error loading Victoria\'s work:', error);
    }

    return docs;
  }

  private loadSupportingDocs(): KnowledgeDocument[] {
    const docs: KnowledgeDocument[] = [];
    const basePath = path.join(__dirname, '../../../knowledge-base/supporting');
    let docId = 2000; // Start supporting docs at ID 2000

    try {
      // 1. Dataset Summary - comprehensive data overview
      const datasetSummaryPath = path.join(basePath, 'dataset_summary.txt');
      if (fs.existsSync(datasetSummaryPath)) {
        const content = fs.readFileSync(datasetSummaryPath, 'utf-8');
        docs.push({
          id: docId++,
          title: "Dataset Summary Analysis",
          content: content,
          docType: 'data-exploration',
          source: 'dataset_summary.txt',
          contributor: 'Victoria'
        });
      }

      // 2. Trend & Distribution Analysis - statistical patterns
      const trendAnalysisPath = path.join(basePath, 'trend_n_dist_analysis.txt');
      if (fs.existsSync(trendAnalysisPath)) {
        const content = fs.readFileSync(trendAnalysisPath, 'utf-8');
        docs.push({
          id: docId++,
          title: "Trend & Distribution Analysis",
          content: content,
          docType: 'analysis',
          source: 'trend_n_dist_analysis.txt',
          contributor: 'Victoria'
        });
      }

      // 3. Outlier Treatment Output - data cleaning details
      const outlierTreatmentPath = path.join(basePath, 'outlier_treatment_output.txt');
      if (fs.existsSync(outlierTreatmentPath)) {
        const content = fs.readFileSync(outlierTreatmentPath, 'utf-8');
        docs.push({
          id: docId++,
          title: "Outlier Treatment Output",
          content: content,
          docType: 'data-cleaning',
          source: 'outlier_treatment_output.txt',
          contributor: 'Victoria'
        });
      }

      // 4. GradientBoosting Environmental Imputation Log
      const gbEnvImputationPath = path.join(basePath, 'gb_env_imputation_log.txt');
      if (fs.existsSync(gbEnvImputationPath)) {
        const content = fs.readFileSync(gbEnvImputationPath, 'utf-8');
        docs.push({
          id: docId++,
          title: "GradientBoosting Environmental Imputation Log",
          content: content,
          docType: 'imputation-log',
          source: 'gb_env_imputation_log.txt',
          contributor: 'Victoria'
        });
      }

    } catch (error) {
      console.warn('Error loading supporting documents:', error);
    }

    return docs;
  }

  private categorizeSection(title: string): string {
    const lower = title.toLowerCase();
    
    if (lower.includes('data familiarization') || lower.includes('dataset summary')) {
      return 'data-exploration';
    }
    if (lower.includes('distribution') || lower.includes('trend')) {
      return 'analysis';
    }
    if (lower.includes('outlier') || lower.includes('missing') || lower.includes('imputation')) {
      return 'data-cleaning';
    }
    if (lower.includes('feature engineering') || lower.includes('feature extraction')) {
      return 'feature-engineering';
    }
    if (lower.includes('model') || lower.includes('training') || lower.includes('prediction')) {
      return 'modeling';
    }
    if (lower.includes('setup') || lower.includes('import')) {
      return 'setup';
    }
    if (lower.includes('summary') || lower.includes('conclusion')) {
      return 'summary';
    }
    
    return 'documentation';
  }

  getDocuments(): KnowledgeDocument[] {
    return this.documents;
  }

  searchDocuments(query: string, limit: number = 5): Array<KnowledgeDocument & { relevanceScore: number }> {
    const lowerQuery = query.toLowerCase();
    const queryTerms = lowerQuery.split(/\s+/).filter(term => term.length > 2);

    // Check for contributor-specific queries
    const wantsMaria = lowerQuery.includes('maria');
    const wantsVictoria = lowerQuery.includes('victoria');

    // Score each document based on query relevance
    const scoredDocs = this.documents.map(doc => {
      let score = 0;
      const lowerContent = doc.content.toLowerCase();
      const lowerTitle = doc.title.toLowerCase();

      // Title matches are weighted heavily
      for (const term of queryTerms) {
        if (term === 'maria' || term === 'victoria') continue; // Skip contributor names in scoring
        
        if (lowerTitle.includes(term)) {
          score += 3;
        }
        // Count occurrences in content - escape special regex characters
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedTerm, 'gi');
        const matches = lowerContent.match(regex);
        if (matches) {
          score += matches.length * 0.5;
        }
      }

      // Boost contributor-specific requests
      if (wantsMaria && doc.contributor === 'Maria') score *= 2;
      if (wantsVictoria && doc.contributor === 'Victoria') score *= 2;

      // Boost specific doc types based on query
      if (lowerQuery.includes('feature') && doc.docType === 'feature-engineering') score *= 1.5;
      if (lowerQuery.includes('model') && doc.docType === 'modeling') score *= 1.5;
      if (lowerQuery.includes('data') && doc.docType === 'data-exploration') score *= 1.5;
      if (lowerQuery.includes('imputation') && (doc.docType === 'data-cleaning' || doc.docType === 'imputation-log')) score *= 1.5;
      if (lowerQuery.includes('pipeline') && doc.docType === 'methodology') score *= 1.5;
      if (lowerQuery.includes('log') && (doc.docType === 'imputation-log' || doc.docType === 'training-log')) score *= 1.5;
      if (lowerQuery.includes('prediction') && doc.docType === 'predictions') score *= 1.5;

      // Normalize score to 0-1 range
      const normalizedScore = Math.min(score / 20, 1);

      return {
        ...doc,
        relevanceScore: normalizedScore
      };
    });

    // Sort by relevance and return top results
    return scoredDocs
      .filter(doc => doc.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }
}

export const knowledgeBase = new KnowledgeBase();
