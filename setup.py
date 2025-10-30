from setuptools import setup, find_packages

setup(
    name="mastra",
    version="0.1",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "fastapi",
        "uvicorn",
        "aiohttp",
        "pydantic"
    ],
    python_requires=">=3.7",
)
