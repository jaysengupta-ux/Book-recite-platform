
import HeroSection from '@/components/HeroSection'
import BookCard from '@/components/BookCard'
import { getAllBooks } from '@/database/actions/book.actions'


const page = async ({ searchParams }: { searchParams: Promise<{ query?: string }> }) => {
    const { query } = await searchParams;

    const bookResults = await getAllBooks(query)
    const books = bookResults.success ? bookResults.data ?? [] : []
  return (
    <main className= "wrapper container">
      <HeroSection />

      <div className="library-books-grid">
        {books.map((book)=> (
          <BookCard key={book._id} title={book.title} author={book.author}
          coverURL={book.coverURL} slug={book.slug} />
        ))}
      </div>
    </main>
  )
}

export default page
