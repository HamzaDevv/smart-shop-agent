import re
from typing import List, Tuple
from langchain.schema import Document
from langchain.text_splitter import MarkdownTextSplitter
from .ingestor import RobustIngestor
from config import CHUNK_OVERLAP, CHUNK_SIZE
import pandas as pd


def markdown_to_df(markdown_table: str) -> pd.DataFrame:
    """Converts a markdown table string to a pandas DataFrame."""
    lines = markdown_table.strip().split("\n")
    # Use the first line as header
    header = [h.strip() for h in lines[0].strip("|").split("|")]
    # Use remaining lines (skipping the separator line) as data
    data = [[cell.strip() for cell in row.strip("|").split("|")] for row in lines[2:]]
    return pd.DataFrame(data, columns=header)


def table_to_string_rows(df: pd.DataFrame) -> str:
    """
    Converts a pandas DataFrame into a string where each row is a
    comma-separated list of "column: value" pairs.
    """
    formatted_rows = []
    columns = df.columns
    for _, row in df.iterrows():
        row_string = ", ".join([f"{col}: {row[col]}" for col in columns])
        formatted_rows.append(row_string)
    return "\n".join(formatted_rows)


def clean_markdown_table(table: str) -> str:
    """
    Optimized cleanup of markdown tables for LLM processing:
    1. Removes empty columns and rows
    2. Normalizes formatting
    3. Strips currency symbols
    4. Minimizes string operations
    """
    # Precompile regex for better performance with repeated use
    CURRENCY_PATTERN = re.compile(r"[₹$,]")
    PIPE_PATTERN = re.compile(r"\s*\|\s*")

    # Fast initial processing
    lines: List[str] = []
    for line in table.splitlines():
        if stripped := line.strip():
            lines.append(stripped)

    # Early exit for invalid tables
    if len(lines) < 2:
        return table

    # Process header and separator more efficiently
    header_parts = [
        part.strip() for part in PIPE_PATTERN.split(lines[0]) if part.strip()
    ]
    if len(header_parts) < 2:
        return table

    num_columns = len(header_parts)
    cleaned_lines = [
        f"| {' | '.join(header_parts)} |",
        f"|{'|'.join(['---'] * num_columns)}|",
    ]

    # Process rows with minimal allocations
    for row in lines[2:]:
        cells = []
        for cell in PIPE_PATTERN.split(row):
            if cleaned := CURRENCY_PATTERN.sub("", cell.strip()):
                cells.append(cleaned)

        # Only keep rows with substantial content
        if len(cells) >= num_columns // 2:
            # Ensure we don't exceed original column count
            row_content = cells[:num_columns]
            cleaned_lines.append(f"| {' | '.join(row_content)} |")

    return "\n".join(cleaned_lines)


def chunk_splitter(text: str) -> Tuple[List[Document], List[Document]]:
    """
    Splits markdown into two types of Documents: tables and normal text.
    Returns: (table_docs, text_docs)
    """

    text_splitter = MarkdownTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )

    # 1. Extract markdown tables using regex
    table_pattern = re.compile(r"((?:\|.+\|\n)+)", re.MULTILINE)
    tables = table_pattern.findall(text)
    non_table_text = table_pattern.sub("", text)

    table_docs = []
    for table in tables:
        cleaned = table_to_string_rows(markdown_to_df(clean_markdown_table(table)))
        if cleaned:
            table_docs.append(Document(page_content=cleaned))

    # 2. Chunk non-table markdown text
    text_chunks = text_splitter.split_text(non_table_text)
    text_docs = [Document(page_content=chunk) for chunk in text_chunks]

    return table_docs, text_docs


if __name__ == "__main__":
    file_path = (
        "/Users/hamza/Developer/Imp_Projects/smart_shop_ai/documents/laptop_bill.pdf"
    )

    ingestor = RobustIngestor(input_file=file_path)
    text = ingestor.run()

    table_doc, text_docs = chunk_splitter(text)
    # Create mock Document objects
    for table in table_doc:
        print(table)

    print("=" * 40)

    for text in text_docs:
        print(text)
