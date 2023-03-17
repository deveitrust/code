using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Dependency;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Net.Mail;
using Castle.Windsor;
using CloudDatabase.Authorization.Users;
using CloudDatabase.Dto;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Threading.Tasks;

namespace CloudDatabase.Base
{
    /// <summary>
    /// Base class to work with DevExpress and ASP.NET Boilerplate
    /// </summary>
    public abstract class DxCrudAppService<TEntity, TEntityDto, TPrimaryKey, 
            TCreateInput, TUpdateInput, TUploadInput, TUploadOutput>
        : AsyncCrudAppService<TEntity, TEntityDto, TPrimaryKey, 
            PagedDxResultRequestDto, TCreateInput, TUpdateInput, EntityDto<TPrimaryKey>>,
        IDxCrudAppService<TEntityDto, TPrimaryKey, TCreateInput, TUpdateInput>
        where TEntity : class, IEntity<TPrimaryKey>
        where TEntityDto : IEntityDto<TPrimaryKey>
        where TUpdateInput : IEntityDto<TPrimaryKey>
        where TUploadInput : UploadInput
        where TUploadOutput : UploadOutput
    {
        protected DxCrudAppService(IRepository<TEntity, TPrimaryKey> repository)
            : base(repository)
        {
            LocalizationSourceName = CloudDatabaseConsts.LocalizationSourceName;
        }

        public override async Task<TEntityDto> Update(TUpdateInput input)
        {
            CheckUpdatePermission();

            // get entity from db by id
            var entity = await GetEntityByIdAsync(input.Id);

            // map from dto to db entity
            MapToEntity(input, entity);

            // save changes
            await SaveChangesAsync();

            // get updated DTO to return
            return MapToEntityDto(entity);
        }

        public virtual Task<LoadResult> Load(PagedDxResultRequestDto input)
        {
            CheckGetAllPermission();

            // get IQueryable for all entitites
            var query = GetAll();

            // load data by DevExpress lib
            var loadResult = Load(query, input);

            // create DTO from DevExpress result
            loadResult.data = loadResult.data
                .Cast<TEntity>()
                .Select(MapToEntityDto)
                .ToList();

            // return result
            return Task.FromResult(loadResult);
        }

        protected virtual IQueryable<TEntity> GetAll()
        {
            return Repository.GetAll();
        }

        protected virtual LoadResult Load(IQueryable<TEntity> query, PagedDxResultRequestDto input)
        {
            return DataSourceLoader.Load(query, input);
        }

        public void SaveChanges()
        {
            CurrentUnitOfWork.SaveChanges();
        }

        public Task SaveChangesAsync()
        {
            return CurrentUnitOfWork.SaveChangesAsync();
        }

        protected virtual List<TEntityDto> MapToEntityDto(IEnumerable<TEntity> entities)
        {
            var result = new List<TEntityDto>();
            foreach (var entity in entities)
            {
                result.Add(MapToEntityDto(entity));
            }
            return result;
        }

        protected virtual List<TEntityDto> MapToEntityDto(IList<TEntity> entities)
        {
            var count = entities.Count;
            var result = new List<TEntityDto>(count);
            for (var i = 0; i < count; ++i)
            {
                var entity = entities[i];
                var entityDto = MapToEntityDto(entity);
                result.Add(entityDto);
            }
            return result;
        }
    }

    public abstract class DxCrudAppService<TEntity, TEntityDto, TPrimaryKey, 
            TCreateInput, TUpdateInput>
        : DxCrudAppService<TEntity, TEntityDto, TPrimaryKey, 
            TCreateInput, TUpdateInput, UploadInput, UploadOutput>
        where TEntity : class, IEntity<TPrimaryKey>
        where TEntityDto : IEntityDto<TPrimaryKey>
        where TUpdateInput : IEntityDto<TPrimaryKey>
    {
        protected DxCrudAppService(IRepository<TEntity, TPrimaryKey> repository)
            : base(repository)
        {
        }
    }
}
