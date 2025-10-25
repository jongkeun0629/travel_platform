export default function TagList({ title, tags }) {
    if (!tags || tags.length === 0) {
        return (
            <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">설정된 항목이 없습니다.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-800">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span
                    key={tag}
                    className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-200 rounded-full"
                    >
                        #{tag}
                    </span>
                ))}
            </div>
        </div>
    );
}