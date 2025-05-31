import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const book = sqliteTable('book', {
    id: integer('id')
        .primaryKey({ autoIncrement: true }),
    title: text('name')
        .notNull(),
    author_id: integer('author_id')
        .references(() => author.id, { onDelete: 'set null' }),
    series_id: integer('series_id')
        .references(() => series.id, { onDelete: 'set null' }),
    genre_id: integer('genre_id')
        .references(() => genre.id, { onDelete: 'set null' }),
    owned: integer('owned')
        .default(0)
        .notNull(),
});



export const author = sqliteTable('author', {
    id: integer('id')
        .primaryKey({ autoIncrement: true }),
    name: text('name')
        .notNull(),
});

export const series = sqliteTable('series', {
    id: integer('id')
        .primaryKey({ autoIncrement: true }),
    name: text('name')
        .notNull(),
    author_id: integer('author_id')
        .references(() => author.id, { onDelete: 'set null' }),
});

export const genre = sqliteTable('genre', {
    id: integer('id')
        .primaryKey({ autoIncrement: true }),
    name: text('name')
        .notNull(),
});


// Export Types to use as an interface in your app
export type Book = typeof book.$inferSelect;
export type Author = typeof author.$inferSelect;
export type Series = typeof series.$inferSelect;
export type Genre = typeof genre.$inferSelect;

export type NewBook = typeof book.$inferInsert;
export type NewAuthor = typeof author.$inferInsert;
export type NewSeries = typeof series.$inferInsert;
export type NewGenre = typeof genre.$inferInsert;

export type BookWithDetails = {
    book: Book;
    author?: Author;
    series?: Series;
    genre?: Genre;
};
