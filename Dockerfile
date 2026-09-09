# 1. DEFINE REGISTRY AS AN EXPLICIT ARGUMENT UNTIL THE PARSER CLEARING
ARG REGISTRY=://microsoft.com

# Use the explicitly initialized registry block variables to clear the parser warning
FROM ${REGISTRY}/dotnet/sdk:10.0 AS build-env
WORKDIR /app

# Copy project files and restore dependencies explicitly
COPY ./*.csproj ./
RUN dotnet restore

# Copy the rest of the code and publish a Release build
COPY . ./
RUN dotnet publish -c Release -o out

# 2. REDECLARE THE ARGUMENT FOR THE MULTI-STAGE SCOPE CONTINUATION
ARG REGISTRY=://microsoft.com
FROM ${REGISTRY}/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build-env /app/out .

# FIXED: Changed 'NES_Box_Art.dll' to match your exact file name with spaces
ENTRYPOINT ["dotnet", "NES Box Art.dll"]