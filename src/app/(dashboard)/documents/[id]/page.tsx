"use client";

import { useState, useCallback } from "react";
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
} from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { useToast } from "@/components/base/toast/toast";
import { cx } from "@/utils/cx";
import { EditorToolbar } from "./components";
import { mockDocuments, documentTypeConfig, statusConfig } from "./data/mock-data";

export default function DocumentEditorPage() {
  const params = useParams();
  const documentId = params.id as string;
  const { addToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Get document data
  const document = mockDocuments[documentId] || mockDocuments["doc-01"];
  const typeConfig = documentTypeConfig[document.type];
  const TypeIcon = typeConfig.icon;

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
    content: document.content,
    editable: isEditing,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[500px] px-8 py-6",
      },
    },
  });

  const handleSave = useCallback(() => {
    if (!editor) return;
    
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
      console.log("Document saved:", editor.getHTML());
      addToast({
        type: "success",
        title: "Document saved",
        message: "Your changes have been saved successfully.",
      });
    }, 1000);
  }, [editor, addToast]);

  const handleToggleEdit = () => {
    if (isEditing && editor) {
      handleSave();
    }
    setIsEditing(!isEditing);
    editor?.setEditable(!isEditing);
  };

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
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
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
              <h1 className="text-md font-semibold text-primary">{document.name}</h1>
              <div className="flex items-center gap-2 text-sm text-tertiary">
                <span>{document.systemName}</span>
                <span>•</span>
                <BadgeWithDot size="sm" color={statusConfig[document.status].color}>
                  {statusConfig[document.status].label}
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
              iconLeading={({ className }) => <Sms size={18} color="currentColor" className={className} />}
              onClick={() => alert("Email functionality coming soon!")}
            >
              Email
            </Button>
            <Button
              size="sm"
              color="secondary"
              iconLeading={({ className }) => <DocumentDownload size={18} color="currentColor" className={className} />}
              onClick={() => alert("Download functionality coming soon!")}
            >
              Download
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
            <span>Generated: {document.generatedAt}</span>
            <span>•</span>
            <span>Last updated: {document.updatedAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge size="sm" color={typeConfig.color}>
              {typeConfig.label}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
