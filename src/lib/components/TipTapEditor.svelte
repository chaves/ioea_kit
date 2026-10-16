<script lang="ts">
	import { onMount, onDestroy, untrack } from 'svelte';
	import type { Editor } from '@tiptap/core';

	interface Props {
		content?: string;
		name?: string;
		placeholder?: string;
		onchange?: (html: string) => void;
	}

	let { content = '', name = 'content', placeholder = 'Start writing…', onchange }: Props = $props();

	let element: HTMLDivElement;
	let editor: Editor | undefined = $state(undefined);
	let currentHtml = $state(untrack(() => content));

	onMount(async () => {
		const { Editor } = await import('@tiptap/core');
		const { StarterKit } = await import('@tiptap/starter-kit');
		const { Placeholder } = await import('@tiptap/extension-placeholder');

		editor = new Editor({
			element,
			extensions: [
				// StarterKit ships Link since v3, so it is configured through the kit
				// rather than added alongside it — registering both would collide on
				// the "link" extension name. Placeholder is still separate.
				StarterKit.configure({ link: { openOnClick: false } }),
				Placeholder.configure({ placeholder })
			],
			content,
			onUpdate({ editor }) {
				currentHtml = editor.getHTML();
				onchange?.(currentHtml);
			}
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});

	function toggleMark(mark: string, options?: Record<string, unknown>) {
		if (!editor) return;
		(editor.chain().focus() as any)[`toggle${mark}`](options).run();
	}

	function isActive(name: string, attrs?: Record<string, unknown>) {
		return editor?.isActive(name, attrs) ?? false;
	}

	function setLink() {
		const prev = editor?.getAttributes('link').href ?? '';
		const url = window.prompt('URL', prev);
		if (url === null) return;
		if (url === '') {
			editor?.chain().focus().unsetLink().run();
		} else {
			editor?.chain().focus().setLink({ href: url }).run();
		}
	}
</script>

<div class="border border-slate-200 rounded-lg overflow-hidden bg-white">
	<!-- Toolbar -->
	<div class="flex flex-wrap gap-1 p-2 border-b border-slate-200 bg-slate-50">
		<button type="button" onclick={() => toggleMark('Bold')} class="toolbar-btn {isActive('bold') ? 'active' : ''}" title="Bold"><strong>B</strong></button>
		<button type="button" onclick={() => toggleMark('Italic')} class="toolbar-btn {isActive('italic') ? 'active' : ''}" title="Italic"><em>I</em></button>
		<button type="button" onclick={() => toggleMark('Strike')} class="toolbar-btn {isActive('strike') ? 'active' : ''}" title="Strikethrough"><s>S</s></button>
		<div class="w-px bg-slate-300 mx-1"></div>
		<button type="button" onclick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} class="toolbar-btn {isActive('heading', { level: 2 }) ? 'active' : ''}" title="Heading 2">H2</button>
		<button type="button" onclick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} class="toolbar-btn {isActive('heading', { level: 3 }) ? 'active' : ''}" title="Heading 3">H3</button>
		<div class="w-px bg-slate-300 mx-1"></div>
		<button type="button" onclick={() => toggleMark('BulletList')} class="toolbar-btn {isActive('bulletList') ? 'active' : ''}" title="Bullet list">• List</button>
		<button type="button" onclick={() => toggleMark('OrderedList')} class="toolbar-btn {isActive('orderedList') ? 'active' : ''}" title="Ordered list">1. List</button>
		<div class="w-px bg-slate-300 mx-1"></div>
		<button type="button" onclick={setLink} class="toolbar-btn {isActive('link') ? 'active' : ''}" title="Link">Link</button>
		<button type="button" onclick={() => editor?.chain().focus().unsetLink().run()} class="toolbar-btn" title="Remove link" disabled={!isActive('link')}>Unlink</button>
		<div class="w-px bg-slate-300 mx-1"></div>
		<button type="button" onclick={() => editor?.chain().focus().toggleBlockquote().run()} class="toolbar-btn {isActive('blockquote') ? 'active' : ''}" title="Quote">"</button>
		<button type="button" onclick={() => editor?.chain().focus().setHorizontalRule().run()} class="toolbar-btn" title="Horizontal rule">—</button>
		<div class="w-px bg-slate-300 mx-1"></div>
		<button type="button" onclick={() => editor?.chain().focus().undo().run()} class="toolbar-btn" title="Undo">↩</button>
		<button type="button" onclick={() => editor?.chain().focus().redo().run()} class="toolbar-btn" title="Redo">↪</button>
	</div>

	<!-- Editor area -->
	<div bind:this={element} class="min-h-[300px] p-4 news-content focus-within:outline-none"></div>

	<!-- Hidden input to submit HTML with the form -->
	<input type="hidden" {name} value={currentHtml} />
</div>

<style>
	:global(.toolbar-btn) {
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: #475569;
		background: transparent;
		border: 1px solid transparent;
		cursor: pointer;
		transition: all 0.15s;
		min-width: 2rem;
		text-align: center;
	}
	:global(.toolbar-btn:hover) {
		background: #e2e8f0;
		color: #453659;
	}
	:global(.toolbar-btn.active) {
		background: rgba(93, 74, 120, 0.12);
		color: #453659;
		border-color: rgba(93, 74, 120, 0.3);
	}
	:global(.toolbar-btn:disabled) {
		opacity: 0.4;
		cursor: not-allowed;
	}
	:global(.tiptap p.is-editor-empty:first-child::before) {
		color: #94a3b8;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
	:global(.tiptap) {
		outline: none;
	}
</style>
