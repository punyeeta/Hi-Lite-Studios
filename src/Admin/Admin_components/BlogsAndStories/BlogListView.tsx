import type { BlogStory } from '@/supabase/supabase_services/Blogs_Stories/Blogs_stories'

interface BlogListViewProps {
  stories: BlogStory[]
  pinnedStories: BlogStory[]
  otherStories: BlogStory[]
  loading: boolean
  saving: boolean
  error: string | null
  onNewStory: () => void
  onEditStory: (story: BlogStory) => void
  onDeleteStory: (story: BlogStory) => Promise<void>
  onPinToggle: (story: BlogStory) => Promise<void>
}

export default function BlogListView({
  stories,
  pinnedStories,
  otherStories,
  loading,
  saving,
  error,
  onNewStory,
  onEditStory,
  onDeleteStory,
  onPinToggle,
}: BlogListViewProps) {
  const renderStoryCard = (story: BlogStory) => (
    <article
      key={story.id}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="relative aspect-4/3 w-full bg-gray-100">
        {story.cover_image ? (
          <img
            src={story.cover_image}
            alt={story.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            No cover image
          </div>
        )}
        {story.is_pinned && (
          <span className="absolute left-3 top-3 rounded-full bg-[#F2322E] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
            Pinned
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
            {story.title}
          </h3>
          <p className="text-[11px] uppercase tracking-wide text-gray-400">
            {new Date(story.created_at).toLocaleDateString()} •{' '}
            <span
              className={
                story.status === 'published'
                  ? 'text-green-600'
                  : story.status === 'draft'
                  ? 'text-gray-500'
                  : 'text-red-500'
              }
            >
              {story.status}
            </span>
          </p>
        </div>

        <p className="line-clamp-3 text-xs text-gray-600">
          {story.excerpt || 'No excerpt yet.'}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={() => onPinToggle(story)}
            disabled={saving}
            className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-sm ${
              story.is_pinned
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-[#F2322E] text-white hover:bg-[#d51e1a]'
            } disabled:cursor-not-allowed disabled:bg-gray-300`}
          >
            {story.is_pinned ? 'Remove Pin' : 'Pin'}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEditStory(story)}
              className="rounded-full bg-[#291471] px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#1e0f55]"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDeleteStory(story)}
              disabled={saving}
              className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600 shadow-sm hover:bg-gray-200 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onNewStory}
          className="rounded-full bg-[#291471] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#1e0f55]"
        >
          Add New Blog
        </button>

        {stories.length > 0 && (
          <p className="text-xs text-gray-500">
            Showing <strong>{stories.length}</strong> post
            {stories.length !== 1 && 's'}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !stories.length ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={`skeleton-${index}`}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse"
            >
              <div className="aspect-4/3 w-full bg-gray-300" />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="space-y-2">
                  <div className="h-5 w-3/4 rounded bg-gray-300" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-5/6 rounded bg-gray-200" />
                  <div className="h-3 w-4/6 rounded bg-gray-200" />
                </div>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <div className="h-7 w-20 rounded-full bg-gray-200" />
                  <div className="flex gap-2">
                    <div className="h-7 w-16 rounded-full bg-gray-200" />
                    <div className="h-7 w-16 rounded-full bg-gray-200" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-sm text-gray-500">
          No stories yet. Click <span className="font-semibold">Add New Blog</span> to
          create your first post.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {pinnedStories.map(renderStoryCard)}
          {otherStories.map(renderStoryCard)}
        </div>
      )}
    </div>
  )
}


