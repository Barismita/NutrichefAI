from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "NutriChef AI"
    app_version: str = "1.0.0"
    ai_provider: str = "mock"

    mongo_uri: str
    database_name: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
