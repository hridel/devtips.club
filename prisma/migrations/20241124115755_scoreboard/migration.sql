CREATE MATERIALIZED VIEW IF NOT EXISTS scoreboard AS
WITH average_values AS (
    SELECT
        AVG(r.score) AS average_rating,
        COUNT(r.score) AS average_votes
    FROM
        ratings r
),
     bayesian_score AS (
         SELECT
             t.id AS tip_id,
             t.title,
             t.html_content,
             t.created_at,
             t.updated_at,
             COALESCE(
                     (average_values.average_votes * average_values.average_rating + SUM(r.score) / COUNT(r.score) * COUNT(r.score)) / (average_values.average_votes + COUNT(r.score)),
                     0
             ) AS score
         FROM
             tips t
                 LEFT JOIN
             ratings r ON t.id = r.tip_id,
             average_values
         GROUP BY
             t.id, t.title, t.html_content, t.created_at, t.updated_at, average_values.average_rating, average_values.average_votes
     )
SELECT
    tip_id,
    title,
    html_content,
    created_at,
    updated_at,
    score
FROM
    bayesian_score;