"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import NextLink from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import TiptapLink from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import {
  ArrowLeft,
  DocumentDownload,
  TickCircle,
  Sms,
  Save2,
  Edit2,
  Clock,
} from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { useToast } from "@/components/base/toast/toast";
import { cx } from "@/utils/cx";
import { EditorToolbar, VersionHistoryPanel } from "./components";
import { documentTypeConfig, statusConfig } from "./data/mock-data";
import { useDocument } from "@/hooks";

export default function DocumentEditorPage() {
  const params = useParams();
  const documentId = params.id as string;
  const { addToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  // Fetch document from API
  const { document: apiDocument, isLoading, updateDocument } = useDocument(documentId);

  // Get document type config
  const docType = (apiDocument?.type as keyof typeof documentTypeConfig) || "technical";
  const typeConfig = documentTypeConfig[docType] || documentTypeConfig.technical;
  const TypeIcon = typeConfig.icon;
  
  // Get status config
  const docStatus = (apiDocument?.status as "draft" | "final") || "draft";
  const currentStatusConfig = statusConfig[docStatus] || statusConfig.draft;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your document...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TiptapLink.configure({
        openOnClick: false,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: apiDocument?.content || "<p>Start writing your document...</p>",
    editable: isEditing,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-6",
      },
    },
  });

  const handleSave = useCallback(async () => {
    if (!editor) return;
    
    setIsSaving(true);
    try {
      // Update document content and status via API
      const content = editor.getHTML();
      const success = await updateDocument({ content, status: "draft" });
      if (success) {
        setLastSaved(new Date());
        addToast({
          type: "success",
          title: "Document saved",
          message: "Your changes have been saved successfully.",
        });
      } else {
        addToast({
          type: "error",
          title: "Save failed",
          message: "Failed to save document. Please try again.",
        });
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Save failed",
        message: "An error occurred while saving.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [editor, addToast, updateDocument]);

  const handleToggleEdit = () => {
    if (isEditing && editor) {
      handleSave();
    }
    setIsEditing(!isEditing);
    editor?.setEditable(!isEditing);
  };

  // Autosave functionality - save after 3 seconds of inactivity while editing
  useEffect(() => {
    if (!editor || !isEditing) return;

    const handleUpdate = () => {
      setHasUnsavedChanges(true);
      
      // Clear existing timer
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
      
      // Set new timer for autosave after 3 seconds
      autosaveTimerRef.current = setTimeout(async () => {
        if (editor && isEditing) {
          const content = editor.getHTML();
          try {
            const success = await updateDocument({ content });
            if (success) {
              setLastSaved(new Date());
              setHasUnsavedChanges(false);
            }
          } catch (error) {
            console.error("Autosave failed:", error);
          }
        }
      }, 3000);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [editor, isEditing, updateDocument]);

  // Update editor content when API document loads
  useEffect(() => {
    if (editor && apiDocument?.content && !isEditing) {
      editor.commands.setContent(apiDocument.content);
    }
  }, [editor, apiDocument?.content, isEditing]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <LoadingIndicator type="dot-circle" size="md" label="Loading editor..." />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-secondary_subtle">
      {/* Header */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 py-4 lg:px-8">
        {/* Back link */}
        <NextLink
          href="/documents"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-tertiary hover:text-secondary"
        >
          <ArrowLeft size={16} color="currentColor" />
          Back to Documents
        </NextLink>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cx("flex h-10 w-10 items-center justify-center rounded-lg", typeConfig.bgColor)}>
              <TypeIcon size={20} className={typeConfig.textColor} color="currentColor" variant="Bold" />
            </div>
            <div>
              <h1 className="text-md font-semibold text-primary">{apiDocument?.name || "Untitled Document"}</h1>
              <div className="flex items-center gap-2 text-sm text-tertiary">
                <span>{apiDocument?.systemName || "Unknown System"}</span>
                <span>•</span>
                <BadgeWithDot size="sm" color={currentStatusConfig.color}>
                  {currentStatusConfig.label}
                </BadgeWithDot>
                {lastSaved && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <TickCircle size={14} color="currentColor" className="text-success-500" />
                      Saved
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              color="secondary"
              iconLeading={({ className }) => <Clock size={18} color="currentColor" className={className} />}
              onClick={() => setIsVersionHistoryOpen(true)}
            >
              History
            </Button>
                        <Button
              size="sm"
              color={isEditing ? "primary" : "secondary"}
              iconLeading={({ className }) => isEditing 
                ? <Save2 size={18} color="currentColor" className={className} /> 
                : <Edit2 size={18} color="currentColor" className={className} />
              }
              onClick={handleToggleEdit}
              isDisabled={isSaving}
            >
              {isSaving ? "Saving..." : isEditing ? "Save & Exit" : "Edit Document"}
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar - Only show when editing */}
      {isEditing && (
        <EditorToolbar
          editor={editor}
          onAddLink={addLink}
          onAddImage={addImage}
          onInsertTable={insertTable}
        />
      )}

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl py-8 px-6 lg:px-8">
          <div className={cx(
            "rounded-xl bg-primary shadow-sm ring-1 ring-secondary ring-inset",
            isEditing && "ring-2 ring-brand-500"
          )}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Footer - Document info */}
      <div className="shrink-0 border-t border-secondary bg-primary px-6 py-3 lg:px-8">
        <div className="flex items-center justify-between text-sm text-tertiary">
          <div className="flex items-center gap-4">
            <span>Created: {apiDocument?.createdAt || "—"}</span>
            <span>•</span>
            <span>Last updated: {apiDocument?.updatedAt || "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge size="sm" color={typeConfig.color}>
              {typeConfig.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Version History Panel */}
      <VersionHistoryPanel
        documentId={documentId}
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
        onVersionRestored={(newDocId) => {
          // Navigate to the new version
          window.location.href = `/documents/${newDocId}`;
        }}
      />
    </div>
  );
}
