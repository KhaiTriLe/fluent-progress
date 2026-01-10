"use client";

import { useContext, useState } from "react";
import { AppContext } from "@/components/app-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SentenceForm from "@/components/sentence-form";
import type { Topic, Sentence } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import SentenceItem from "@/components/sentence-item";

interface SentenceLibraryProps {
    showHeader?: boolean;
}

export default function SentenceLibrary({ showHeader = false }: SentenceLibraryProps) {
  const { topics, crudTopic, crudSentence, toggleSentenceSelection, isLoaded } = useContext(AppContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editingSentence, setEditingSentence] = useState<Sentence | null>(null);
  const [isAddingSentenceToTopic, setIsAddingSentenceToTopic] = useState(false);
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);

  const handleOpenFormForNewTopic = () => {
    setEditingTopic(null);
    setEditingSentence(null);
    setIsAddingSentenceToTopic(false);
    setIsFormOpen(true);
  };
  
  const handleOpenFormForNewSentence = (topic: Topic) => {
    setEditingTopic(topic);
    setEditingSentence(null);
    setIsAddingSentenceToTopic(true);
    setIsFormOpen(true);
  };

  const handleOpenFormForEdit = (topic: Topic, sentence?: Sentence) => {
    setEditingTopic(topic);
    setEditingSentence(sentence || null);
    setIsAddingSentenceToTopic(false);
    setIsFormOpen(true);
  };
  
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTopic(null);
    setEditingSentence(null);
    setIsAddingSentenceToTopic(false);
  };
  
  const handleDeleteTopic = (topic: Topic) => {
    crudTopic('delete', topic);
  }

  const handleDeleteSentence = (topicId: string, sentence: Sentence) => {
    crudSentence('delete', topicId, sentence);
  }
  
  const getDialogTitle = () => {
    if (isAddingSentenceToTopic && editingTopic) return `Add Sentence to "${editingTopic.name}"`;
    if (editingSentence && editingTopic) return 'Edit Sentence';
    if (editingTopic) return 'Edit Topic';
    return 'Add New Topic';
  }


  return (
    <>
      {showHeader && (
         <header className="mb-8 flex items-center justify-between">
            <div>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary">
                Sentence Library
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
                Manage your practice sentences and topics.
            </p>
            </div>
            <Button onClick={handleOpenFormForNewTopic}><Plus className="mr-2 h-4 w-4" /> New Topic</Button>
        </header>
      )}

      {!showHeader && (
        <div className="mb-8">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-primary">
                Sentence Library
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
                Select sentences to add them to your practice set above.
            </p>
        </div>
      )}


      {isLoaded ? (
         <Accordion type="multiple" className="w-full space-y-4" value={openAccordionItems} onValueChange={setOpenAccordionItems}>
         {topics.map((topic) => (
           <AccordionItem key={topic.id} value={topic.id} className="rounded-lg border bg-card shadow-sm">
             <div className="flex items-center p-4">
               <AccordionTrigger className="flex-1 font-headline text-lg hover:no-underline py-0">
                 <span>{topic.name}</span>
               </AccordionTrigger>
               <div className="flex items-center gap-2 ml-4">
                  <button 
                    className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleOpenFormForEdit(topic); }}
                    aria-label="Edit topic"
                  >
                      <Edit className="h-4 w-4" />
                  </button>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <button 
                            className="inline-flex items-center justify-center rounded-md h-8 w-8 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Delete topic"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the topic "{topic.name}" and all its sentences.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteTopic(topic)}>Delete</AlertDialogAction></AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
                  <button 
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background h-8 px-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleOpenFormForNewSentence(topic); }}
                    aria-label="Add sentence"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add
                  </button>
               </div>
             </div>
             <AccordionContent className="p-4 pt-0">
               <ul className="space-y-3">
                 {topic.sentences.map((sentence) => (
                   <SentenceItem 
                    key={sentence.id}
                    sentence={sentence}
                    topic={topic}
                    onToggleSelection={toggleSentenceSelection}
                    onEdit={handleOpenFormForEdit}
                    onDelete={handleDeleteSentence}
                   />
                 ))}
                 {topic.sentences.length === 0 && (
                    <li className="text-center text-sm text-muted-foreground py-4">
                        No sentences in this topic.
                    </li>
                 )}
               </ul>
             </AccordionContent>
           </AccordionItem>
         ))}
       </Accordion>
      ) : (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
      )}
      
      {isLoaded && topics.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
            <p>You haven't created any topics yet.</p>
            <Button onClick={handleOpenFormForNewTopic} className="mt-4"><Plus className="mr-2 h-4 w-4" /> Create Your First Topic</Button>
        </div>
      )}


      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
                {getDialogTitle()}
            </DialogTitle>
          </DialogHeader>
          <SentenceForm
            topic={editingTopic}
            sentence={editingSentence}
            isAddingSentenceToTopic={isAddingSentenceToTopic}
            onClose={handleFormClose}
            crudTopic={crudTopic}
            crudSentence={crudSentence}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
