from datetime import datetime

import pytest
from fastapi import HTTPException, status
from httpx import ASGITransport, AsyncClient
from pydantic import ValidationError

import app.api.profile_api as profile_api
import app.services.profile_service as profile_service
from app.main import app
from app.schemas.profile_schema import (
    CreateProfileRequest,
    ProfileResponse,
    UpdateProfileRequest,
)

transport = ASGITransport(app=app)


class MockProfile:
    def __init__(self):
        self.name = "John"
        self.category = "Personal"
        self.allergies = ["Peanuts"]
        self.updated_at = datetime.utcnow()

    async def insert(self):
        pass

    async def save(self):
        pass

    async def delete(self):
        pass


# ----------------------------------------------------------
# create_profile
# ----------------------------------------------------------


@pytest.mark.asyncio
async def test_create_profile(monkeypatch):

    monkeypatch.setattr(
        profile_service,
        "Profile",
        lambda **kwargs: MockProfile(),
    )

    request = CreateProfileRequest(
        name="John",
        category="Personal",
        allergies=["Peanuts"],
    )

    profile = await profile_service.ProfileService.create_profile(request)

    assert profile.name == "John"
    assert profile.category == "Personal"
    assert profile.allergies == ["Peanuts"]


# ----------------------------------------------------------
# get_profile
# ----------------------------------------------------------


@pytest.mark.asyncio
async def test_get_profile(monkeypatch):

    profile = MockProfile()

    async def mock_get(_):
        return profile

    monkeypatch.setattr(
        profile_service.Profile,
        "get",
        mock_get,
    )

    result = await profile_service.ProfileService.get_profile(
        "507f1f77bcf86cd799439011"
    )

    assert result is profile


@pytest.mark.asyncio
async def test_get_profile_not_found(monkeypatch):

    async def mock_get(_):
        return None

    monkeypatch.setattr(
        profile_service.Profile,
        "get",
        mock_get,
    )

    result = await profile_service.ProfileService.get_profile(
        "507f1f77bcf86cd799439011"
    )

    assert result is None


# ----------------------------------------------------------
# get_all_profiles
# ----------------------------------------------------------


@pytest.mark.asyncio
async def test_get_all_profiles(monkeypatch):

    profiles = [MockProfile(), MockProfile()]

    class MockQuery:
        async def to_list(self):
            return profiles

    monkeypatch.setattr(
        profile_service.Profile,
        "find_all",
        lambda: MockQuery(),
    )

    result = await profile_service.ProfileService.get_all_profiles()

    assert len(result) == 2


# ----------------------------------------------------------
# update_profile
# ----------------------------------------------------------


@pytest.mark.asyncio
async def test_update_profile(monkeypatch):

    profile = MockProfile()

    async def mock_get(_):
        return profile

    monkeypatch.setattr(
        profile_service.Profile,
        "get",
        mock_get,
    )

    request = UpdateProfileRequest(
        category="Fitness",
    )

    result = await profile_service.ProfileService.update_profile(
        "507f1f77bcf86cd799439011",
        request,
    )

    assert result.category == "Fitness"


@pytest.mark.asyncio
async def test_update_profile_not_found(monkeypatch):

    async def mock_get(_):
        return None

    monkeypatch.setattr(
        profile_service.Profile,
        "get",
        mock_get,
    )

    result = await profile_service.ProfileService.update_profile(
        "507f1f77bcf86cd799439011",
        UpdateProfileRequest(),
    )

    assert result is None


# ----------------------------------------------------------
# delete_profile
# ----------------------------------------------------------


@pytest.mark.asyncio
async def test_delete_profile(monkeypatch):

    profile = MockProfile()

    async def mock_get(_):
        return profile

    monkeypatch.setattr(
        profile_service.Profile,
        "get",
        mock_get,
    )

    result = await profile_service.ProfileService.delete_profile(
        "507f1f77bcf86cd799439011"
    )

    assert result is True


@pytest.mark.asyncio
async def test_delete_profile_not_found(monkeypatch):

    async def mock_get(_):
        return None

    monkeypatch.setattr(
        profile_service.Profile,
        "get",
        mock_get,
    )

    result = await profile_service.ProfileService.delete_profile(
        "507f1f77bcf86cd799439011"
    )

    assert result is False


# ----------------------------------------------------------
# CreateProfileRequest
# ----------------------------------------------------------


def test_create_profile_request_valid():

    request = CreateProfileRequest(
        name="John",
        category="Personal",
        allergies=["Peanuts"],
    )

    assert request.name == "John"
    assert request.category == "Personal"
    assert request.allergies == ["Peanuts"]


def test_create_profile_request_empty_name():

    with pytest.raises(ValidationError):
        CreateProfileRequest(
            name="",
            category="Personal",
            allergies=[],
        )


def test_create_profile_request_default_allergies():

    request = CreateProfileRequest(
        name="John",
        category="Personal",
    )

    assert request.allergies == []


# ----------------------------------------------------------
# UpdateProfileRequest
# ----------------------------------------------------------


def test_update_profile_request_partial():

    request = UpdateProfileRequest(
        category="Fitness",
    )

    assert request.category == "Fitness"
    assert request.name is None
    assert request.allergies is None


def test_update_profile_request_all_fields():

    request = UpdateProfileRequest(
        name="Alice",
        category="Business",
        allergies=["Milk"],
    )

    assert request.name == "Alice"
    assert request.category == "Business"
    assert request.allergies == ["Milk"]


# ----------------------------------------------------------
# ProfileResponse
# ----------------------------------------------------------


def test_profile_response_valid():

    now = datetime.utcnow()

    response = ProfileResponse(
        id="507f1f77bcf86cd799439011",
        name="John",
        category="Personal",
        allergies=["Peanuts"],
        created_at=now,
        updated_at=now,
    )

    assert response.id == "507f1f77bcf86cd799439011"
    assert response.name == "John"
    assert response.category == "Personal"
    assert response.allergies == ["Peanuts"]


def test_profile_response_empty_allergies():

    now = datetime.utcnow()

    response = ProfileResponse(
        id="507f1f77bcf86cd799439011",
        name="John",
        category="Personal",
        allergies=[],
        created_at=now,
        updated_at=now,
    )

    assert response.allergies == []


def test_profile_response_missing_required_field():

    now = datetime.utcnow()

    with pytest.raises(ValidationError):
        ProfileResponse(
            id="507f1f77bcf86cd799439011",
            category="Personal",
            allergies=[],
            created_at=now,
            updated_at=now,
        )


def valid_profile():
    return {
        "id": "507f1f77bcf86cd799439011",
        "name": "John",
        "category": "Personal",
        "allergies": ["Peanuts"],
        "created_at": "2025-01-01T10:00:00",
        "updated_at": "2025-01-01T10:00:00",
    }


def create_payload():
    return {
        "name": "John",
        "category": "Personal",
        "allergies": ["Peanuts"],
    }


def update_payload():
    return {
        "category": "Fitness",
    }


# ----------------------------------------------------------
# CREATE PROFILE
# ----------------------------------------------------------


@pytest.mark.asyncio
async def test_create_profile_success(monkeypatch):

    async def mock_create_profile(data):
        return valid_profile()

    monkeypatch.setattr(
        profile_api.ProfileService,
        "create_profile",
        mock_create_profile,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.post(
            "/profiles/",
            json=create_payload(),
        )

    assert response.status_code == status.HTTP_201_CREATED

    body = response.json()

    assert body["name"] == "John"
    assert body["category"] == "Personal"


@pytest.mark.asyncio
async def test_create_profile_internal_error(monkeypatch):

    async def mock_create_profile(data):
        raise Exception("Database error")

    monkeypatch.setattr(
        profile_api.ProfileService,
        "create_profile",
        mock_create_profile,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.post(
            "/profiles/",
            json=create_payload(),
        )

    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert response.json()["detail"] == "Database error"


# ----------------------------------------------------------
# GET ALL PROFILES
# ----------------------------------------------------------


@pytest.mark.asyncio
async def test_get_profiles_success(monkeypatch):

    async def mock_get_all_profiles():
        return [
            valid_profile(),
            valid_profile(),
        ]

    monkeypatch.setattr(
        profile_api.ProfileService,
        "get_all_profiles",
        mock_get_all_profiles,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.get("/profiles/")

    assert response.status_code == status.HTTP_200_OK

    body = response.json()

    assert len(body) == 2


# ----------------------------------------------------------
# GET PROFILE
# ----------------------------------------------------------


@pytest.mark.asyncio
async def test_get_profile_success(monkeypatch):

    async def mock_get_profile(profile_id):
        return valid_profile()

    monkeypatch.setattr(
        profile_api.ProfileService,
        "get_profile",
        mock_get_profile,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.get("/profiles/507f1f77bcf86cd799439011")

    assert response.status_code == status.HTTP_200_OK

    body = response.json()

    assert body["name"] == "John"


@pytest.mark.asyncio
async def test_get_profile_not_found(monkeypatch):

    async def mock_get_profile(profile_id):
        return None

    monkeypatch.setattr(
        profile_api.ProfileService,
        "get_profile",
        mock_get_profile,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.get("/profiles/507f1f77bcf86cd799439011")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Profile not found"


# ----------------------------------------------------------
# UPDATE PROFILE
# ----------------------------------------------------------


@pytest.mark.asyncio
async def test_update_profile_success(monkeypatch):

    profile = valid_profile()
    profile["category"] = "Fitness"

    async def mock_update_profile(profile_id, data):
        return profile

    monkeypatch.setattr(
        profile_api.ProfileService,
        "update_profile",
        mock_update_profile,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.put(
            "/profiles/507f1f77bcf86cd799439011",
            json=update_payload(),
        )

    assert response.status_code == status.HTTP_200_OK

    body = response.json()

    assert body["category"] == "Fitness"


@pytest.mark.asyncio
async def test_update_profile_not_found(monkeypatch):

    async def mock_update_profile(profile_id, data):
        return None

    monkeypatch.setattr(
        profile_api.ProfileService,
        "update_profile",
        mock_update_profile,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.put(
            "/profiles/507f1f77bcf86cd799439011",
            json=update_payload(),
        )

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Profile not found"


# ----------------------------------------------------------
# DELETE PROFILE
# ----------------------------------------------------------


@pytest.mark.asyncio
async def test_delete_profile_success(monkeypatch):

    async def mock_delete_profile(profile_id):
        return True

    monkeypatch.setattr(
        profile_api.ProfileService,
        "delete_profile",
        mock_delete_profile,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.delete("/profiles/507f1f77bcf86cd799439011")

    assert response.status_code == status.HTTP_204_NO_CONTENT


@pytest.mark.asyncio
async def test_delete_profile_not_found(monkeypatch):

    async def mock_delete_profile(profile_id):
        return False

    monkeypatch.setattr(
        profile_api.ProfileService,
        "delete_profile",
        mock_delete_profile,
    )

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.delete("/profiles/507f1f77bcf86cd799439011")

    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert response.json()["detail"] == "Profile not found"


# ----------------------------------------------------------
# INVALID REQUESTS
# ----------------------------------------------------------


@pytest.mark.asyncio
async def test_create_profile_invalid_payload():

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.post(
            "/profiles/",
            json={
                "category": "Personal",
            },
        )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.asyncio
async def test_update_profile_invalid_payload():

    async with AsyncClient(
        transport=transport,
        base_url="http://test",
    ) as client:

        response = await client.put(
            "/profiles/507f1f77bcf86cd799439011",
            json={
                "allergies": "Peanuts",
            },
        )

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
